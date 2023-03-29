from django.conf import settings
from google.auth import crypt, jwt
from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account


class GoogleTicket:
    """
    Model for Google Wallet tickets.
    """

    @staticmethod
    def get_service_account_info():
        """
        Get the service account credentials.
        """
        return {
            "type": "service_account",
            "project_id": "socialpass-358508",
            "private_key_id": settings.GOOGLE_WALLET_PRIVATE_KEY_ID,
            # NOTE: must replace newline character from .env value
            # This ensure GOOGLE_WALLET_PRIVATE_KEY is in proper format
            "private_key": settings.GOOGLE_WALLET_PRIVATE_KEY.replace(r"\n", "\n"),
            "client_email": "wallet-web-client@socialpass-358508.iam.gserviceaccount.com",
            "client_id": settings.GOOGLE_WALLET_CLIENT_ID,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/wallet-web-client%40socialpass-358508.iam.gserviceaccount.com",  # noqa
        }

    @staticmethod
    def authenticate(service_account_info, scopes):
        """
        Authenticate with the Google API.
        """
        credentials = service_account.Credentials.from_service_account_info(
            service_account_info, scopes=scopes
        )
        http_client = AuthorizedSession(credentials)

        return http_client

    @staticmethod
    def get_issuer_id():
        """
        Get the issuer ID.
        """
        return settings.GOOGLE_WALLET_ISSUER_ID

    @staticmethod
    def get_event_class_payload(event_obj):
        """
        Get the payload for inserting/updating a ticket class.
        """
        # Create the address from the fields
        venue_name = event_obj.address_1
        address = event_obj.localized_address_display.replace(
            venue_name + ", ", "", 1
        )

        # Create the payload
        payload = {
            "eventName": {
                "defaultValue": {"language": "en-us", "value": event_obj.title}
            },
            "reviewStatus": "UNDER_REVIEW",
            "dateTime": {
                "start": event_obj.start_date.isoformat(),
            },
            "venue": {
                "name": {
                    "defaultValue": {
                        "language": "en-us",
                        "value": venue_name,
                    }
                },
                "address": {
                    "defaultValue": {
                        "language": "en-us",
                        "value": address,
                    }
                },
            },
        }

        # Add datetime end (if available)
        if event_obj.end_date:
            payload["dateTime"]["end"] = event_obj.end_date.isoformat()

        return payload

    @staticmethod
    def insert_update_event_class(
        event_obj,
        is_insert=True,
        issuer_name="SocialPass",
        logo_uri="https://res.cloudinary.com/nfty-labs/image/upload/v1660211657/socialpass-ticket-logo_lzcnkm.png",  # noqa
        hex_bg_color="#ef7c4e",
    ):
        """
        Insert/update a ticket class. Call post-save when an Event object is
        created/updated.
        """
        service_account_info = GoogleTicket.get_service_account_info()
        http_client = GoogleTicket.authenticate(
            service_account_info=service_account_info,
            scopes=["https://www.googleapis.com/auth/wallet_object.issuer"],
        )
        class_id = f"{GoogleTicket.get_issuer_id()}.{str(event_obj.public_id)}"
        url = "https://walletobjects.googleapis.com/walletobjects/v1/eventTicketClass"
        payload = GoogleTicket.get_event_class_payload(event_obj)

        # Add branding attributes to the payload
        # White-labeling is handled here if needed
        theme = event_obj.team.theme
        payload["issuerName"] = theme.get("ticket_brand_name", issuer_name)
        payload["hexBackgroundColor"] = theme.get("ticket_bg_color", hex_bg_color)
        payload["logo"] = {"sourceUri": {"uri": theme.get(
            "ticket_logo_google", logo_uri
        )}}

        # Insert or update the ticket class
        if is_insert:
            payload["id"] = class_id
            response = http_client.post(url, json=payload)
        else:
            url = url + "/" + class_id
            response = http_client.patch(url, json=payload)

        return response

    @staticmethod
    def create_ticket(ticket_obj):
        """
        Create a ticket.
        """
        event = ticket_obj.event
        service_account_info = GoogleTicket.get_service_account_info()
        http_client = GoogleTicket.authenticate(
            service_account_info=service_account_info,
            scopes=["https://www.googleapis.com/auth/wallet_object.issuer"],
        )
        ticket_id = f"{GoogleTicket.get_issuer_id()}.{str(ticket_obj.public_id)}"
        class_id = "{}.{}".format(
            GoogleTicket.get_issuer_id(),
            str(event.public_id),
        )
        url = "https://walletobjects.googleapis.com/walletobjects/v1/eventTicketObject"

        ticket_type = ticket_obj.ticket_tier.ticket_type
        if ticket_obj.party_size > 1:
            ticket_type += f" | Party Size: {ticket_obj.party_size}"

        payload = {
            "id": ticket_id,
            "classId": class_id,
            "state": "ACTIVE",
            "ticketType": {
                "defaultValue": {
                    "language": "en-us",
                    "value": ticket_type,
                }
            },
            "barcode": {"type": "QR_CODE", "value": str(ticket_obj.embed_code)},
        }
        response = http_client.post(url, json=payload)
        return response

    @staticmethod
    def get_ticket_url(ticket_id):
        """
        Get the save URL for a Google ticket.
        """
        service_account_info = GoogleTicket.get_service_account_info()
        claims = {
            "iss": service_account_info["client_email"],
            "aud": "google",
            "origins": ["socialpass.io"],
            "typ": "savetowallet",
            "payload": {"eventTicketObjects": [{"id": ticket_id}]},
        }
        signer = crypt.RSASigner.from_service_account_info(service_account_info)
        token = jwt.encode(signer, claims).decode("utf-8")
        save_url = "https://pay.google.com/gp/v/save/%s" % token
        return save_url
