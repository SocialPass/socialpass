from django.test import TestCase
from apps.services.blockchain_service import moralis_get_nonfungible_assets


class TestBlockchainService(TestCase):
    def test_moralis_get_fungible_assets(self):
        assets = moralis_get_nonfungible_assets(
            chain_id="",
            wallet_address="",
            token_address="",
            token_ids=None,
            required_amount=0
        )
        print(assets)
        return True
