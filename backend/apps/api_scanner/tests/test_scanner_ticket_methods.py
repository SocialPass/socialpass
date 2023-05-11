from apps.root.exceptions import AlreadyRedeemedError, ForbiddenRedemptionError
from apps.root.testing import BaseTestCaseWrapper


class TestScannerTicketMethods(BaseTestCaseWrapper):
    def setUp(self):
        return super().setUp()

    def test_redeem_ticket(self):
        """
        tests if the ticket is being successfully redeemed
        - if ticket is already redeemed, must raise AlreadyRedeemedError exception
        - if ticket event != self.redemption_access_key event, must raise
            ForbiddenRedemptionError exception
        """
        # test forbidden redemption
        with self.assertRaises(ForbiddenRedemptionError):
            self.ticket.redeem_ticket("")

        # test ticket redeemed
        redeemed_ticket = self.ticket.redeem_ticket(self.redemption_access_key)
        self.assertEqual(redeemed_ticket.redeemed, True)

        # test already redeemed
        with self.assertRaises(AlreadyRedeemedError):
            redeemed_ticket.redeem_ticket()
