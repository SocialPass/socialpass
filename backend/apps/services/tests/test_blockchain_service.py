from django.test import TestCase

from apps.services.blockchain_service import moralis_get_nonfungible_assets


class TestBlockchainService(TestCase):
    def test_moralis_get_nonfungible_assets(self):
        """
        top owner of BAYC
        https://etherscan.io/token/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d?a=0x5b523dc90a79cf5ee5d095825e586e33780f7188
        """
        assets = moralis_get_nonfungible_assets(
            chain_id=hex(1),
            wallet_address="0x1b523dc90a79cf5ee5d095825e586e33780f7188",
            token_address="0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
            token_ids=None,
            required_amount=1,
        )
        # assert assets have been returned
        return self.assertTrue(len(assets) > 1)
