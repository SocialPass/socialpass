from typing import List, Optional

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

from apps.root.models import Ticket


class AppleWalletPass:
    """
    Class responsible for create Apple Wallet Pass
    """

    SOCIALPASS_RGB = "rgb(239,124,78)"
    WHITE_RGB = "rgb(255,255,255)"
    ORG_NAME = "Hashed Inc."

    def __init__(self, ticket: Ticket) -> None:
        self.ticket = ticket
        self.event = ticket.event
        self.ticket_public_id = str(self.ticket.public_id)
        self.pass_type_id = settings.APPLE_WALLET_PASS_TYPE_ID
        self.team_id = settings.APPLE_WALLET_TEAM_ID
        self.password = settings.APPLE_WALLET_PASSWORD
        self.certificate = self.format_certificate(settings.APPLE_WALLET_CERTIFICATE)
        self.certificate_key = self.format_certificate(settings.APPLE_WALLET_KEY)
        self.wwrd_certificate = self.format_certificate(
            settings.APPLE_WALLET_WWDR_CERTIFICATE
        )

    @staticmethod
    def format_certificate(value: str) -> str:
        return value.encode("UTF-8").decode("unicode_escape")

    def create_event_ticket_info(self) -> EventTicket:
        """
        create EventTicket object with name and location and date
        """
        event_info = EventTicket()

        # add event date
        if self.event.start_date:
            date = self.event.start_date.strftime("%d %B, %Y")
            date_field = Field("when", date, "", "", Alignment.RIGHT)
            event_info.headerFields.append(date_field)

        event_info.addPrimaryField("name", self.event.title, "EVENT")
        event_info.addSecondaryField("where", self.event.location, "WHERE")

        return event_info

    def create_barcode(self) -> Barcode:
        return Barcode(message=str(self.ticket.embed_code), format=BarcodeFormat.QR)

    def create_location_list(self) -> Optional[List[Location]]:
        if self.event.lat and self.event.long:
            return [Location(latitude=self.event.lat, longitude=self.event.long)]
        return None

    def create_passfile(
        self, event_info: EventTicket, barcode: Barcode, location: Location
    ) -> Pass:
        # passfile object
        passfile = Pass(
            passInformation=event_info,
            barcode=barcode,
            locations=location,
            description=self.event.description,
            passTypeIdentifier=self.pass_type_id,
            teamIdentifier=self.team_id,
            serialNumber=self.ticket_public_id,
            organizationName=self.ORG_NAME,
            backgroundColor=self.SOCIALPASS_RGB,
            foregroundColor=self.WHITE_RGB,
            labelColor=self.WHITE_RGB,
        )

        # Including the icon and logo is necessary for the passbook to be valid.
        icon_path = settings.ROOT_DIR / "static" / "images" / "socialpass-white.png"
        passfile.addFile("icon.png", open(icon_path, "rb"))
        passfile.addFile("logo.png", open(icon_path, "rb"))

        # generate ticket
        passfile.create(
            self.certificate, self.certificate_key, self.wwrd_certificate, self.password
        )
        return passfile

    def generate_apple_wallet_pass(self):
        """
        generate passfile in-memory
            - passfile.read() to read bytes
            - passfile.writetofile(filename) to save in disk
        """
        event_info = self.create_event_ticket_info()
        barcode = self.create_barcode()
        location = self.create_location_list()
        passfile = self.create_passfile(
            event_info=event_info, barcode=barcode, location=location
        )

        return passfile
