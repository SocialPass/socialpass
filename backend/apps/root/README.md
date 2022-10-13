# Root
As the name implies, `apps/root` sits at the center of the SocialPass application.
This app contains the core database schema and its related migrations, factories for the database schema, shared utility classes, an admin interface and more.

A more detailed breakdown is below.

# `management/`
Contains custom `manage.py` commands.

# `migrations/`
Contains SQL migrations for database schema.

# `utilities/`
Contains shared utility classes / functions

# `admin.py`
Contains the admin interface

# `models.py`
Contains database model class definitions
This codebase follows the 'fat model' approach, so a significant chunk of business logic is also stored here via fields, methods and properties.

The following is an overview of the model schema and their relations

## Event Organization
- A `User` model represents the end-user of the platform.
- This user manages events via their `Team`
- A `User` can have unlimited `Team`s, via the `Membership` model
- A `User` can be invited to join a `Team` via `Invite`

## Ticket Tiers
- An `Event` supports an unlimited number of `TicketTier`s.
- Each `TicketTier` supports any combination of the three payment tiers: `TierFiat`, `TierBlockchain`, and `TierAssetOwnership`

## Event Checkout
- An `Event` supports an unlimited number of `CheckoutSession`s.
- A `CheckoutSession` supports an unlimited number of `CheckoutItem`s
- Each `CheckoutItem` corresponds to a `TicketTier`
- A `CheckoutSession` cannot support  `CheckoutItem`s with varying types of payment tiers.
- A `CheckoutSession` is completed via one of the transaction models, depending on payment tier: `TxFiat`, `TxBlockchain`, `TxAssetOwnership`
- A `Ticket` is distributed upon successful transaction, and is related to its `Event`, `CheckoutSession`, `CheckoutItem`, `TicketTier`.

## Ticket Scanning
- An `Event` supports an unlimited number of `TicketRedemptionKey`s