# SocialPass - Checkout Portal API
The `api_checkoutportal` app contains the API for the SocialPass Checkout Portal. The checkout frontend is contained in `socialpass/frontend/eventportal`.

This API is planned to support two separate checkout flows. Currently, only the 1st is supported.
1. Asset Ownership: Prove asset ownership to claim tickets
2. Point of Sale Payments: Pay in crypto or fiat to purchase tickets

## Asset Ownership Flow
1. `CheckoutPortalRetrieve` - Fetch Event
2. `CheckoutPortalOwnershipRequest` - Request Event entry based on asset ownership
3. `CheckoutPortalOwnershipVerify` - Verify Event entry based on asset ownership
4. `CheckoutPortalConfirmation` - Checkout Confirmation. Deliver tickets to user.

## Point of Sale Payments Flow
1. `CheckoutPortalRetrieve` - Fetch Event
TBD...
4. `CheckoutPortalConfirmation` - Checkout Confirmation. Deliver tickets to user.  