# SocialPass - Checkout Portal API
The `api_checkoutportal` app contains the API for the SocialPass Checkout Portal. The related frontend is contained in `socialpass/frontend/checkout-app`.

On a high level, the goal of this API is to connect potential attendees with tickets in a straightforward and simple manner.  This API is currently designed to support two separate checkout flows.
1. Asset Ownership: Prove asset ownership to claim tickets
2. Point of Sale Payments: Pay in crypto or fiat to purchase tickets

Both of these checkout flows revolve around the `Attendee` model, where data corresponding to either of the flows are stored.

## Asset Ownership Flow
1. `CheckoutPortalRetrieve` - Fetch Event
2. `CheckoutPortalOwnershipRequest` - Request Event entry based on asset ownership
3. `CheckoutPortalOwnershipVerify` - Verify Event entry based on asset ownership
4. `CheckoutPortalConfirmation` - Checkout Confirmation. Deliver tickets to user.

## Point of Sale Payments Flow
1. `CheckoutPortalRetrieve` - Fetch Event
TBD...
4. `CheckoutPortalConfirmation` - Checkout Confirmation. Deliver tickets to user.