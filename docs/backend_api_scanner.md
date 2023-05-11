# SocialPass - Scanner API
The `api_scanner` app contains the API for the SocialPass Scanner. The related frontend is contained in `socialpass/frontend/scanner-app`.

The main purpose behind the API scanner is to enable the ticket scanning. This API has one flow.
1. Scanning: Scann tickets using a redemption_access_key

## Scanning Flow
1. `EventRetrieve` - Fetch Event for the given redemption_access_key
2. `ScanTicket` - Scan ticket for the given embedcode and redemption_access_key
3. `TicketsListView` - List tickets for the given redemption_access_key
