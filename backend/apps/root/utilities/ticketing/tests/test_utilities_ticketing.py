import os
from io import BytesIO
from re import search
from typing import Any
from unittest import mock
from unittest.mock import patch

from django.conf import settings
from django.core.validators import URLValidator
from django.test import TestCase
from passbook.models import BarcodeFormat, Location
from PyPDF2 import PdfReader

from apps.root.factories import (
    CheckoutItemFactory,
    CheckoutSessionFactory,
    EventFactory,
    TicketFactory,
    TicketTierFactory,
    UserWithTeamFactory,
)
from apps.root.models import (
    CheckoutItem,
    CheckoutSession,
    Event,
    Team,
    Ticket,
    TicketTier,
)
from apps.root.utilities.ticketing import AppleTicket, GoogleTicket, PDFTicket


class TestCaseWrapper(TestCase):
    event: Event
    ticket: Ticket
    user: Any
    team: Team
    ticket_tier: TicketTier
    checkout_item: CheckoutItem
    checkout_session: CheckoutSession

    @classmethod
    def setUpTestData(cls) -> None:
        cls.user = UserWithTeamFactory()
        cls.team = cls.user.membership_set.first().team
        cls.event = EventFactory(team=cls.team, user=cls.user)
        cls.ticket_tier = TicketTierFactory(event=cls.event)
        cls.checkout_session = CheckoutSessionFactory(event=cls.event)
        cls.checkout_item = CheckoutItemFactory(
            ticket_tier=cls.ticket_tier, checkout_session=cls.checkout_session
        )
        cls.ticket = TicketFactory(
            checkout_item=cls.checkout_item,
            event=cls.event,
            ticket_tier=cls.ticket_tier,
        )
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
            settings.ROOT_DIR, "apps", "root", "tests", "images", "example.jpg"
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

        # raise exception if event has no localized_address_display
        self.event.city = ""
        self.event.address_1 = ""
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
        test `generate_pdf` method by matching the pdf text with
        the context text
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
        _pass = self.ticket_pass.generate_pdf(
            context=context, barcode_content="www.test.com"
        )
        # test in memory pdf creation
        self.assertIsInstance(_pass, BytesIO)

        # test pdf number pages
        reader = PdfReader(_pass)
        self.assertEqual(reader.numPages, 1)

        # test pdf content
        pdf_text = reader.pages[0].extract_text()
        self.assertIsInstance(pdf_text, str)
        self.assertTrue(
            search(
                "We've verified your NFT ownership and generated your ticket!", pdf_text
            )
        )
        self.assertTrue(search("Congratulations!", pdf_text))
        self.assertTrue(search("General Admission", pdf_text))
        self.assertTrue(search(context["event_title"], pdf_text))
        self.assertTrue(search(context["location_name"], pdf_text))
        self.assertTrue(search(context["event_date"], pdf_text))
        self.assertTrue(search(context["event_time"], pdf_text))
        self.assertTrue(search(context["event_timezone"], pdf_text))

    def test_generate_pass_from_ticket(self):
        """
        test generate pass from ticket method
        """

        _pass = self.ticket_pass.generate_pass_from_ticket(ticket=self.ticket)
        self.assertIsInstance(self.ticket_pass.get_bytes(), bytes)

        # test pdf number pages
        reader = PdfReader(_pass)
        self.assertEqual(reader.numPages, 1)

        # test pdf content
        pdf_text = reader.pages[0].extract_text()
        self.assertIsInstance(pdf_text, str)
        self.assertTrue(
            search(
                "We've verified your NFT ownership and generated your ticket!", pdf_text
            )
        )
        singleline_pdf_text = " ".join(line.strip() for line in pdf_text.splitlines())
        self.assertTrue(search("Congratulations!", singleline_pdf_text))
        self.assertTrue(search("General Admission", singleline_pdf_text))
        self.assertTrue(search(self.event.title, singleline_pdf_text))
        self.assertTrue(
            search(self.event.start_date.strftime("%B %d, %Y"), singleline_pdf_text)
        )

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
        pass_bytes = self.ticket_pass.get_bytes()
        self.assertIsInstance(pass_bytes, bytes)

        # test pdf number pages
        reader = PdfReader(BytesIO(pass_bytes))
        self.assertEqual(reader.numPages, 1)

        # test pdf content
        pdf_text = reader.pages[0].extract_text()
        self.assertIsInstance(pdf_text, str)
        self.assertTrue(
            search(
                "We've verified your NFT ownership and generated your ticket!", pdf_text
            )
        )
        self.assertTrue(search("Congratulations!", pdf_text))
        self.assertTrue(search(context["event_title"], pdf_text))

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

        # test raise exception in not address field
        self.event.city = None
        self.event.address_1 = None
        self.event.address_2 = None
        self.event.region = None
        self.event.postal_code = None
        self.event.country = None
        with self.assertRaises(Exception):
            self.ticket_pass.get_ticket_class_payload(self.event)

    def test_get_service_account_info(self):
        """
        test if `get_service_account_info` is returning dictionary with necessary keys
        """

        service_account_info = self.ticket_pass.get_service_account_info()
        self.assertIsInstance(service_account_info, dict)
        self.assertIn("type", service_account_info)
        self.assertIn("project_id", service_account_info)
        self.assertIn("private_key_id", service_account_info)
        self.assertIn("private_key", service_account_info)
        self.assertIn("client_email", service_account_info)
        self.assertIn("client_id", service_account_info)
        self.assertIn("auth_uri", service_account_info)
        self.assertIn("token_uri", service_account_info)
        self.assertIn("auth_provider_x509_cert_url", service_account_info)
        self.assertIn("client_x509_cert_url", service_account_info)

    @patch.object(GoogleTicket.GoogleTicket, "request_creation_ticket")
    def test_generate_pass_from_ticket(self, mock_post):
        """
        test if `generate_pass_from_ticket` method generates
        dictionary with save_url and token keys
           - the request_creation_ticket method is mocked.
        """

        # Define response data from Google API
        mock_response = mock.Mock()
        mock_response.status_code = 200
        issuer = settings.GOOGLE_WALLET_ISSUER_ID
        mock_response.text = f"""{{"id": "{issuer}.{self.ticket.public_id}", "classId": "{issuer}.{self.event.public_id}"}}"""  # noqa
        # Define response for the fake API
        mock_post.return_value = mock_response

        # Call the function
        result = self.ticket_pass.generate_pass_from_ticket(self.ticket)
        # test if returns dict with save_url and token keys
        self.assertIn("save_url", result)
        self.assertIn("token", result)
        self.assertTrue(
            result["save_url"].startswith("https://pay.google.com/gp/v/save/")
        )

    @patch.object(GoogleTicket.GoogleTicket, "request_creation_ticket")
    def test_get_pass_url(self, mock_post):
        """
        test if `get_pass_url` method generates a properly url
           - the request_creation_ticket method is mocked.
        """

        # Define response data from Google API
        mock_response = mock.Mock()
        mock_response.status_code = 200
        issuer = settings.GOOGLE_WALLET_ISSUER_ID
        mock_response.text = f"""{{"id": "{issuer}.{self.ticket.public_id}", "classId": "{issuer}.{self.event.public_id}"}}"""  # noqa
        # Define response for the fake API
        mock_post.return_value = mock_response

        # Call the function
        self.ticket_pass.generate_pass_from_ticket(self.ticket)
        validator = URLValidator()
        # test if generated a url, if not will raise an exception
        save_url = self.ticket_pass.get_pass_url()
        self.assertIsNone(validator(save_url))
        self.assertTrue(save_url.startswith("https://pay.google.com/gp/v/save/"))

    def test_insert_update_ticket_class(self):
        return "Not yet implemented"

    def test_authenticate(self):
        return "Not implemented"


class TestTicketUtilitiesMethods(TestCaseWrapper):
    def test_get_apple_ticket(self):
        """
        test generate apple pkpass bytes
        """

        # generate pass bytes
        self.assertIsInstance(self.ticket.get_apple_ticket(), bytes)

        # raise exception if event has no city or address_1
        self.event.city = ""
        self.event.address_1 = ""
        with self.assertRaises(Exception):
            self.ticket.get_apple_ticket()

    def test_get_pdf_ticket(self):
        """
        test generate pass pdf bytes
        """

        _pass = self.ticket.get_pdf_ticket()
        self.assertIsInstance(_pass, bytes)

        # test pdf number pages
        reader = PdfReader(BytesIO(_pass))
        self.assertEqual(reader.numPages, 1)

        # test pdf content
        pdf_text = reader.pages[0].extract_text()
        self.assertIsInstance(pdf_text, str)
        self.assertTrue(
            search(
                "We've verified your NFT ownership and generated your ticket!", pdf_text
            )
        )
        singleline_pdf_text = " ".join(line.strip() for line in pdf_text.splitlines())
        self.assertTrue(search("Congratulations!", singleline_pdf_text))
        self.assertTrue(search("General Admission", singleline_pdf_text))
        self.assertTrue(search(self.event.title, singleline_pdf_text))
        self.assertTrue(
            search(self.event.start_date.strftime("%B %d, %Y"), singleline_pdf_text)
        )

    @patch.object(GoogleTicket.GoogleTicket, "request_creation_ticket")
    def test_get_google_ticket(self, mock_post):
        """
        test `get_google_ticket` method. check if it is returning a properly url
            - the request_creation_ticket method is mocked.
        """

        # Define response data from Google API
        mock_response = mock.Mock()
        mock_response.status_code = 200
        issuer = settings.GOOGLE_WALLET_ISSUER_ID
        mock_response.text = f"""{{"id": "{issuer}.{self.ticket.public_id}", "classId": "{issuer}.{self.event.public_id}"}}"""  # noqa
        # Define response for the fake API
        mock_post.return_value = mock_response

        # test raise exception if not class_id
        with self.assertRaises(Exception):
            self.ticket.get_google_ticket()

        # test if generated a url, if not will raise an exception
        self.ticket.event.google_class_id = "random_class"
        save_url = self.ticket.get_google_ticket()
        validator = URLValidator()
        self.assertIsNone(validator(save_url))
        self.assertTrue(save_url.startswith("https://pay.google.com/gp/v/save/"))
