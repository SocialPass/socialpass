import os
from tkinter import W
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
