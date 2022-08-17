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


class PassfileDoesNotExists(Exception):
    pass


class AppleWalletPass:
    """
    Class responsible for create Apple Wallet Pass
    """

    def __init__(self, serial_number: str, description: str, org_name: str):

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
        self.location: Optional[List[Location]] = None
        self.event_info = EventTicket()

        # apple wallet certificate credentials
        self.team_id: str = settings.APPLE_WALLET_TEAM_ID
        self.password: str = settings.APPLE_WALLET_PASSWORD
        self.pass_type_id: str = settings.APPLE_WALLET_PASS_TYPE_ID
        self.certificate_key: str = self.format_certificate(settings.APPLE_WALLET_KEY)
        self.certificate: str = self.format_certificate(
            settings.APPLE_WALLET_CERTIFICATE
        )
        self.wwrd_certificate: str = self.format_certificate(
            settings.APPLE_WALLET_WWDR_CERTIFICATE
        )

    @staticmethod
    def format_certificate(value: str) -> str:
        return value.encode("UTF-8").decode("unicode_escape")

    def set_event_ticket_info(
        self, start_date: str, event_title: str, event_location: str
    ) -> EventTicket:
        """
        set EventTicket infos.
        """
        date_field = Field("when", start_date, "", "", Alignment.RIGHT)
        self.event_info.headerFields.append(date_field)
        self.event_info.addPrimaryField("name", event_title, "EVENT")
        self.event_info.addSecondaryField("where", event_location, "WHERE")

    def set_barcode(
        self, link: str, __format: BarcodeFormat = BarcodeFormat.QR
    ) -> Barcode:
        """
        set link and format for pass barcode.
        """
        self.barcode = Barcode(message=link, format=__format)

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

    def get_pass(self) -> Pass:

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

    def write_to_file(self, filename: str = "Event.pkpass"):
        """
        save the `passfile` in disc.
        """
        if not self.passfile:
            raise PassfileDoesNotExists(
                "The passfile must be created with the `get_pass` method first"
            )
        self.passfile.writetofile(filename)

    def get_bytes(self):
        """
        read the passfile bytes.
        useful for sending via API calls or email.
        """
        if not self.passfile:
            raise PassfileDoesNotExists(
                "The passfile must be created with the `get_pass` method first"
            )
        return self.passfile.read()
