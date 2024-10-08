from typing import Optional

from django.conf import settings
from passbook.models import (
    Alignment,
    Barcode,
    BarcodeFormat,
    EventTicket,
    Field,
    Location,
    Pass,
)
import requests
import tempfile


class AppleTicket:
    """
    Class responsible for creating Apple Wallet Pass
    """

    def __init__(self, serial_number: str = "", description: str = "", org_name: str = ""):
        # instantiation values
        self.org_name = org_name
        self.description = description
        self.serial_number = serial_number
        self.passfile: Optional[Pass] = None

        # optional customization
        self.label_color: str = "rgb(255,255,255)"
        self.background_color: str = "rgb(239,124,78)"
        self.foreground_color: str = "rgb(255,255,255)"
        self.icon = settings.ROOT_DIR / "static" / "images" / "socialpass-white.png"
        self.barcode: Optional[Barcode] = None
        self.location: Optional[list[Location]] = None
        self.event_info = EventTicket()

        # apple wallet certificate credentials
        self.team_id: str = settings.APPLE_WALLET_TEAM_ID
        self.password: str = settings.APPLE_WALLET_PASSWORD
        self.pass_type_id: str = settings.APPLE_WALLET_PASS_TYPE_ID
        self.certificate_key: str = self.format_certificate(settings.APPLE_WALLET_KEY)
        self.certificate: str = self.format_certificate(settings.APPLE_WALLET_CERTIFICATE)
        self.wwrd_certificate: str = self.format_certificate(
            settings.APPLE_WALLET_WWDR_CERTIFICATE
        )

    @staticmethod
    def format_certificate(value: str) -> str:
        return value.encode("UTF-8").decode("unicode_escape")

    def set_event_ticket_info(
        self, start_date: str, event_title: str, name: str, event_location: str
    ):
        """
        set EventTicket infos.
        """
        date_field = Field("when", start_date, "", "", Alignment.RIGHT)
        self.event_info.headerFields.append(date_field)
        self.event_info.addPrimaryField("name", event_title, "EVENT")
        self.event_info.addSecondaryField("where", event_location, "WHERE")
        self.event_info.addAuxiliaryField("ticket type", name, "TICKET TYPE")
        self.event_info.addBackField("name", event_title, "EVENT")
        self.event_info.addBackField("where", event_location, "WHERE")
        self.event_info.addBackField("ticket type", name, "TICKET TYPE")

    def set_barcode(self, link: str, _format: BarcodeFormat = BarcodeFormat.QR):
        """
        set link and format for pass barcode.
        """
        self.barcode = Barcode(message=link, format=_format)

    def set_location_list(self, lat: float, long: float):
        """
        set latitude and longitude for the pass.
        """
        self.location = [Location(latitude=lat, longitude=long)]

    def set_foreground_color(self, color: str):
        """
        :param color: RGB string.
        """
        self.foreground_color = color

    def set_background_color(self, color: str):
        """
        :param color: RGB string.
        """
        self.background_color = color

    def set_label_color(self, color: str):
        """
        :param color: RGB string.
        """
        self.label_color = color

    def set_icon(self, path):
        """
        :param path: path to image.
        """
        self.icon = path

    def generate_pass(self) -> Pass:
        # creates passfile object
        self.passfile = Pass(
            passInformation=self.event_info,
            barcode=self.barcode,
            locations=self.location,
            description=self.description,
            passTypeIdentifier=self.pass_type_id,
            teamIdentifier=self.team_id,
            serialNumber=self.serial_number,
            organizationName=self.org_name,
            backgroundColor=self.background_color,
            foregroundColor=self.foreground_color,
            labelColor=self.label_color,
        )

        # Including the icon and logo is necessary for the passbook to be valid.
        self.passfile.addFile("icon.png", open(self.icon, "rb"))
        self.passfile.addFile("logo.png", open(self.icon, "rb"))

        # generate pass in-memory
        self.passfile.create(
            self.certificate, self.certificate_key, self.wwrd_certificate, self.password
        )
        return self.passfile

    def generate_pass_from_ticket(self, ticket):
        event = ticket.event

        if not event.geo_address:
            raise Exception("The event object does not have a geo_address")

        self.org_name = event.team.name
        self.label_color = "rgb(255,255,255)"
        self.background_color = "rgb(239,124,78)"
        self.foreground_color = "rgb(255,255,255)"
        self.icon = settings.ROOT_DIR / "static" / "images" / "socialpass-white.png"

        # White-labeling Apple ticket
        whitelabel = event.team.get_whitelabel()
        if whitelabel:
            if whitelabel.ticket_text_color:
                self.label_color = whitelabel.ticket_text_color
                self.foreground_color = whitelabel.ticket_text_color
            if whitelabel.ticket_bg_color:
                self.background_color = whitelabel.ticket_bg_color

            # Set up the ticket logo for Apple
            if whitelabel.ticket_logo:
                ticket_logo_apple = whitelabel.ticket_logo
            else:
                ticket_logo_apple = whitelabel.logo

            # Use the logo to create temp file and add to the ticket
            if settings.DEBUG:
                url = f"http://localhost:8000{ticket_logo_apple.url}"
            else:
                url = ticket_logo_apple.url
            response = requests.get(url)
            if response.status_code == 200:
                with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                    temp_file.write(response.content)
                    temp_file_path = temp_file.name
            else:
                pass
            self.icon = temp_file_path

        self.description = event.title
        self.serial_number = str(ticket.public_id)
        self.set_barcode(str(ticket.embed_code))
        # FUTURE
        # when latitude/longitude support is added
        # self.set_location_list(event.lat, event.long)

        name = ticket.ticket_tier.name
        if ticket.ticket_tier.category == ticket.ticket_tier.Category.FREE:
            name += " | FREE"
        if ticket.party_size > 1:
            name += f" | Party Size: {ticket.party_size}"

        self.set_event_ticket_info(
            event.start_date.strftime("%d %B, %Y"),
            event.title,
            name,
            event.geo_address,
        )
        self.generate_pass()

    def write_to_file(self, filename: str = "Event.pkpass"):
        """
        save the `passfile` in disc.
        """
        if not self.passfile:
            raise Exception(
                "The passfile must be created with the `get_pass` method first"
            )
        self.passfile.writetofile(filename)

    def get_bytes(self):
        """
        read the passfile bytes.
        useful for sending via API calls or email.
        """
        if not self.passfile:
            raise Exception(
                "The passfile must be created with the `get_pass` method first"
            )
        return self.passfile.read()
