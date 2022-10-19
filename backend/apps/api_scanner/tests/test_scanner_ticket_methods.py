from apps.root.exceptions import AlreadyRedeemedError, ForbiddenRedemptionError
from apps.root.utilities.testing import BaseTestCaseWrapper


class TestScannerTicketMethods(BaseTestCaseWrapper):
    @classmethod
    def setUpTestData(cls) -> None:
        return super().setUpTestData()

    def test_redeem_ticket(self):
        """
        tests if the ticket is being successfully redeemed
        - if ticket is already redeemed, must raise AlreadyRedeemedError exception
        - if ticket event != redemption_access_key event, must raise
            ForbiddenRedemptionError exception
        """
        ticket = self.ticket
        redemption_access_key = self.ticket_redemption_key

        # test ticket redeemed
        redeemed_ticket = ticket.redeem_ticket(redemption_access_key)
        self.assertEqual(redeemed_ticket.redeemed, True)

        # test already redeemed
        with self.assertRaises(AlreadyRedeemedError):
            redeemed_ticket.redeem_ticket()

        # test forbidden redemption
        _ticket = self._ticket
        with self.assertRaises(ForbiddenRedemptionError):
            _ticket.redeem_ticket(redemption_access_key)
