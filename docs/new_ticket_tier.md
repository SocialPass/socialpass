# Integrating a new ticket tier
Reference: https://github.com/SPTech-Group/socialpass/pull/644/files

This page will document the necessary steps for integrating a new ticket tier, broken down into the different parts of the application.

## Backend

- Create a `Tier{Type}` class as an O2O field to the `TicketTier` table. This will contain any tier specific fields.
- Add a new `TransactionType` to the `CheckoutSession` class.
- Create a `Tx{Type}` class as an O2O field to the `CheckoutSession` table. This will contain the `process()` method for handling transactions from the front-end.

## Dashboard

- Add labeling for new ticket tier on the ticket tier list view inside event details.
- Add create button for the new ticket tier type.
- Create ticket tier create view and template that handles the form.
- Make sure to update the necessary template tags and template partials. 

## Tickets page

- If needed, add any tier specific information to the ticket designs, including PNG, Google, and/or Apple.

## Checkout app

#### `Home.tsx`

- Create filter method for getting the new type of ticket tiers (the backend returns all).
- Add new radio button for selecting the new type of ticket tier.
- Make sure the `useEffect` hook used to handle the priority of the checked radio button has the new tier type added to it.

#### `TicketSelector.tsx`

- Add in any tier specific UI to the DOM. Use the `paymentType` prop for specification.

#### `CheckoutAPI.ts`

- Define new API method such as `transact{Type}`

#### `types/Checkout.ts`

- Add type prop for the above API method.

#### `CheckoutContext.ts`

- Create promise for the above API method.

#### `Checkout.tsx`

- Use the above method to handle the transaction for the new type of ticket tier. Usually, it just means calling the right API method depending on the `txType`. 
- Add UI for the new ticket tier checkout. In general, this means adding payment methods or wallet verification. This is specific to the type of ticket tier.