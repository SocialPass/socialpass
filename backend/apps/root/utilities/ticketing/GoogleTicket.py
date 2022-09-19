import json

from django.conf import settings
from google.auth import crypt, jwt
from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account

from apps.root.utilities.ticketing.TicketGeneration import TicketGenerationBase


class GoogleTicket(TicketGenerationBase):
    """
    Model for Google Wallet tickets.
    """

    def __init__(self) -> None:
        self.save_url = None

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
    def get_ticket_class_payload(event_obj):
        """
        Get the payload for inserting/updating a ticket class.
        """
        # Create the address from the fields
        address = ""
        if event_obj.address_1:
            address += event_obj.address_1 + "\n"
        if event_obj.address_2:
            address += event_obj.address_2 + "\n"

        address_items_list = []
        if event_obj.city:
            address_items_list.append(event_obj.city)
        if event_obj.region:
            address_items_list.append(event_obj.region)
        if event_obj.postal_code:
            address_items_list.append(event_obj.postal_code)
        if event_obj.country:
            address_items_list.append(event_obj.country)
        address += ", ".join(address_items_list)

        if not address:
            raise Exception("Address can not be empty")

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
                        "value": event_obj.initial_place,
                    }
                },
                "address": {"defaultValue": {"language": "en-us", "value": address}},
            },
        }

        # Add the latitude and longitude (if available)
        if event_obj.lat and event_obj.long:
            payload["locations"] = [
                {"latitude": float(event_obj.lat), "longitude": float(event_obj.long)}
            ]

        # Add datetime end (if available)
        if event_obj.end_date:
            payload["dateTime"]["end"] = event_obj.end_date.isoformat()

        return payload

    @staticmethod
    def insert_update_ticket_class(
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
        payload = GoogleTicket.get_ticket_class_payload(event_obj)

        # Add branding attributes to the payload
        payload["issuerName"] = issuer_name
        payload["logo"] = {"sourceUri": {"uri": logo_uri}}
        payload["hexBackgroundColor"] = hex_bg_color

        # Insert or update the ticket class
        if is_insert:
            payload["id"] = class_id
            response = http_client.post(url, json=payload)
        else:
            url = url + "/" + class_id
            response = http_client.patch(url, json=payload)

        return json.loads(response.text)

    @staticmethod
    def request_creation_ticket(http_client: AuthorizedSession, url: str, payload: dict):
        return http_client.post(url, json=payload)

    def generate_pass_from_ticket(self, ticket):
        """
        Generate a Google ticket (pass) create the save to wallet URL and
        return it along with the token.
        """
        # Generate the ticket
        service_account_info = self.get_service_account_info()
        http_client = self.authenticate(
            service_account_info=service_account_info,
            scopes=["https://www.googleapis.com/auth/wallet_object.issuer"],
        )
        ticket_id = f"{self.get_issuer_id()}.{str(ticket.public_id)}"
        class_id = "{}.{}".format(
            self.get_issuer_id(),
            str(ticket.event.public_id),
        )
        url = "https://walletobjects.googleapis.com/walletobjects/v1/eventTicketObject"
        payload = {
            "id": ticket_id,
            "classId": class_id,
            "state": "ACTIVE",
            "barcode": {"type": "QR_CODE", "value": str(ticket.embed_code)},
        }
        response = self.request_creation_ticket(http_client, url, payload)

        # Check if there was an error
        if not (200 <= response.status_code <= 299):
            return json.loads(response.text)

        # Get the save to wallet URL
        object_id = json.loads(response.text).get("id")
        claims = {
            "iss": http_client.credentials.service_account_email,
            "aud": "google",
            "origins": ["socialpass.io"],
            "typ": "savetowallet",
            "payload": {"eventTicketObjects": [{"id": object_id}]},
        }
        signer = crypt.RSASigner.from_service_account_info(service_account_info)
        token = jwt.encode(signer, claims).decode("utf-8")
        self.save_url = "https://pay.google.com/gp/v/save/%s" % token

        return {"token": token, "save_url": self.save_url}

    def get_pass_url(self):
        if not self.save_url:
            raise Exception(
                "The pass url was not generated with `generate_pass_from_ticket` method"
            )
        return self.save_url
