import os
from io import BytesIO
from typing import Any

from django.conf import settings
from django.test import TestCase
from passbook.models import BarcodeFormat, Location

from apps.root.factories import EventFactory, TicketFactory, UserWithTeamFactory
from apps.root.models import Event, Team, Ticket
from apps.root.utilities.ticketing import AppleTicket, GoogleTicket, PDFTicket


class TestCaseWrapper(TestCase):
    event: Event
    ticket: Ticket
    user: Any
    team: Team

    @classmethod
    def setUpTestData(cls) -> None:
        cls.user = UserWithTeamFactory()
        cls.team = cls.user.membership_set.first().team
        cls.event = EventFactory(team=cls.team, user=cls.user)
        cls.ticket = TicketFactory(event=cls.event)
        return super().setUpTestData()


class TestAppleTicket(TestCaseWrapper):
    ticket_pass: AppleTicket.AppleTicket

    def setUp(self) -> None:
        self.ticket_pass = AppleTicket.AppleTicket()

    def test_set_event_ticket_info(self):
        """
        test if event ticket information is being set correctly
        """

        start_date = "Jun 1 2005 1:33PM"
        event_title = "Test"
        event_location = "Just a test"
        self.ticket_pass.set_event_ticket_info(
            start_date=start_date,
            event_title=event_title,
            event_location=event_location,
        )
        event_info = self.ticket_pass.event_info

        # test pass type
        self.assertEqual(event_info.jsonname, "eventTicket")

        # test start date field
        self.assertEqual(event_info.headerFields[0].key, "when")
        self.assertEqual(event_info.headerFields[0].value, start_date)

        # test event title field
        self.assertEqual(event_info.primaryFields[0].key, "name")
        self.assertEqual(event_info.primaryFields[0].value, event_title)
        self.assertEqual(event_info.primaryFields[0].label, "EVENT")

        # test location
        self.assertEqual(event_info.secondaryFields[0].key, "where")
        self.assertEqual(event_info.secondaryFields[0].value, event_location)
        self.assertEqual(event_info.secondaryFields[0].label, "WHERE")

    def test_set_barcode(self):
        """
        test set barcode method
        """

        link = "www.test.com"

        self.assertIsNone(self.ticket_pass.barcode)

        # test default barcode formar QR code
        self.ticket_pass.set_barcode(link=link)
        self.assertEqual(self.ticket_pass.barcode.format, BarcodeFormat.QR)

        # test change barcode format
        self.ticket_pass.set_barcode(link=link, _format=BarcodeFormat.PDF417)
        self.assertNotEqual(self.ticket_pass.barcode.format, BarcodeFormat.QR)

    def test_set_location_list(self):
        """
        test set location based on latitude and longitude cordinates
        """

        lat = 10.1
        long = 10.1

        # default: without location
        self.assertIsNone(self.ticket_pass.location)

        # test set location
        self.ticket_pass.set_location_list(lat=lat, long=long)
        self.assertIsInstance(self.ticket_pass.location[0], Location)
        self.assertEqual(self.ticket_pass.location[0].latitude, lat)
        self.assertEqual(self.ticket_pass.location[0].longitude, long)

    def test_set_colors(self):
        """
        test set foreground, background and label color for the pass
        """

        color = "rgb(0,0,0)"

        self.ticket_pass.set_foreground_color(color=color)
        self.ticket_pass.set_background_color(color=color)
        self.ticket_pass.set_label_color(color=color)
        self.assertEqual(self.ticket_pass.foreground_color, color)
        self.assertEqual(self.ticket_pass.background_color, color)
        self.assertEqual(self.ticket_pass.label_color, color)

    def test_set_icon(self):
        """
        test set icon path with relative path
        """

        path = os.path.join(
            settings.ROOT_DIR, "apps", "root", "test", "images", "example.jpg"
        )
        self.ticket_pass.set_icon(path=path)
        self.assertEqual(self.ticket_pass.icon, path)

    def test_generate_pass(self):
        """
        test if `generate_pass` method is creating a passfile correctly.
        passfile_dict dict has the required keys for for a minimum pass
        """

        passfile_dict = {
            "description": "testing",
            "formatVersion": 1,
            "organizationName": "Tester",
            "passTypeIdentifier": settings.APPLE_WALLET_PASS_TYPE_ID,
            "serialNumber": "12345",
            "teamIdentifier": settings.APPLE_WALLET_TEAM_ID,
            "suppressStripShine": False,
            "eventTicket": {},
            "backgroundColor": "rgb(239,124,78)",
            "foregroundColor": "rgb(255,255,255)",
            "labelColor": "rgb(255,255,255)",
        }
        _pass = AppleTicket.AppleTicket(
            serial_number="12345", description="testing", org_name="Tester"
        )
        _pass.generate_pass()
        self.assertDictEqual(_pass.passfile.json_dict(), passfile_dict)

    def test_generate_pass_from_ticket(self):
        """
        test generate pass from ticket method
        """

        # generate pass bytes
        self.ticket_pass.generate_pass_from_ticket(self.ticket)
        self.assertIsInstance(self.ticket_pass.get_bytes(), bytes)

        # raise exception if event has no initial_place
        self.event.initial_place = None
        with self.assertRaises(Exception):
            self.ticket_pass.generate_pass_from_ticket(self.ticket)

        # raise exception if event has no lat or long cordinates
        self.event.initial_place = "West Linda, KY 50295"
        self.event.lat = None
        self.event.long = None
        with self.assertRaises(Exception):
            self.ticket_pass.generate_pass_from_ticket(self.ticket)

    def test_get_bytes(self):
        """
        test `get_bytes` method
        get_bytes returns .pkpass file bytes
        """

        with self.assertRaises(Exception):
            self.ticket_pass.get_bytes()

        self.ticket_pass.generate_pass()
        self.assertIsInstance(self.ticket_pass.get_bytes(), bytes)

    def test_write_to_file(self):
        return "Not yet implemented"


class TestPDFTicket(TestCaseWrapper):
    ticket_pass: PDFTicket.PDFTicket

    def setUp(self) -> None:
        self.ticket_pass = PDFTicket.PDFTicket()

    def test__generate_qr_code(self):
        """
        test if `_generate_qr_code` is generating an image bytes
        """
        self.assertIsInstance(self.ticket_pass._generate_qr_code("").getvalue(), bytes)

    def test__link_callback(self):
        """
        test if _link_callback converts relative URLs to absolute system paths
        """

        # test if is acceptable uri
        path = self.ticket_pass._link_callback(uri=self.event.cover_image.url, rel="")
        self.assertTrue(os.path.isfile(path))

        # test if random string is not acceptable uri
        path = self.ticket_pass._link_callback(uri="random/string", rel="")
        self.assertFalse(os.path.isfile(path))

    def test_generate_pdf(self):
        """
        ...
        """

        context = {
            "event_title": "test pdf",
            "order_number": "54593405723",
            "ticket_quantity": 1,
            "ticket_type": "General Admission",
            "location_name": "West Linda, KY 50295",
            "location_address": "West Linda, KY 50295",
            "event_date": "Jun 1 2005",
            "event_time": "1:33PM",
            "event_timezone": "America/SaoPaulo",
        }
        self.assertIsInstance(
            self.ticket_pass.generate_pdf(
                context=context, barcode_content="www.test.com"
            ),
            BytesIO,
        )

    def test_generate_pass_from_ticket(self):
        """
        test generate pass from ticket method
        """

        self.ticket_pass.generate_pass_from_ticket(ticket=self.ticket)
        self.assertIsInstance(self.ticket_pass.get_bytes(), bytes)

    def test_get_bytes(self):
        """
        test `get_bytes` method
        get_bytes returns .pkpass file bytes
        """

        # test raise excpetion if not created pdfFile
        with self.assertRaises(Exception):
            self.ticket_pass.get_bytes()

        # test get bytes
        context = {"event_title": "test pdf"}
        self.ticket_pass.generate_pdf(context=context)
        self.assertIsInstance(self.ticket_pass.get_bytes(), bytes)

    def test_write_to_file(self):
        return "Not yet implemented"

    def test_set_template(self):
        return "Not yet implemented"


class TestGoogleTicket(TestCaseWrapper):
    ticket_pass: GoogleTicket.GoogleTicket

    def setUp(self) -> None:
        self.ticket_pass = GoogleTicket.GoogleTicket()

    def test_get_ticket_class_payload(self):
        """
        test if payload is being set properly
        """

        payload = self.ticket_pass.get_ticket_class_payload(self.event)
        self.assertEqual(payload["locations"][0]["latitude"], self.event.lat)
        self.assertEqual(payload["locations"][0]["longitude"], self.event.long)
        self.assertEqual(payload["reviewStatus"], "UNDER_REVIEW")
        self.assertEqual(payload["eventName"]["defaultValue"]["value"], self.event.title)
        self.assertEqual(payload["dateTime"]["start"], self.event.start_date.isoformat())

    def test_get_service_account_info(self):
        """
        test if `get_service_account_info` is returning dictionary
        """

        self.assertIsInstance(self.ticket_pass.get_service_account_info(), dict)

    def test_insert_update_ticket_class(self):
        ...

    def test_generate_pass_from_ticket(self):
        ...

    def test_get_pass_url(self):
        ...

    def test_authenticate(self):
        return "Not implemented"


class TestTicketUtilitiesMethods(TestCaseWrapper):
    def test_get_apple_ticket(self):
        """
        test generate apple pkpass bytes
        """

        # generate pass bytes
        self.assertIsInstance(self.ticket.get_apple_ticket(), bytes)

        # raise exception if event has no initial_place
        self.event.initial_place = None
        with self.assertRaises(Exception):
            self.ticket.get_apple_ticket()

        # raise exception if event has no lat or long cordinates
        self.event.initial_place = "West Alba, KY 50295"
        self.event.lat = None
        with self.assertRaises(Exception):
            self.ticket.get_apple_ticket()

    def test_get_pdf_ticket(self):
        """
        test generate pass pdf bytes
        """

        self.assertIsInstance(self.ticket.get_pdf_ticket(), bytes)

    def test_get_google_ticket(self):
        return "Not yet implemented"
