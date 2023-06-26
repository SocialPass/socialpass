# Dashboard

The dashboard is the part of SocialPass that lets users (event organizers) create events on the platform. There's also a team manager part of the dashboard, which allows them to manage team members for proper collaboration.

## Requirements

The app should allow users (organizers) to do the following things:

- Create, update, delete events
- Allow events to be stored as draft
- Manage team details (for branding)
- Add or remove team members
- Manage account information (such as email addresses and passwords)

Apart from the above functional requirements, the app should also adhere to the following:

- Load reasonably fast and work on all browsers
- Be available only for authenticated users

## User Flows

The dashboard has two parts - the event manager and the account manager. In both cases, the main entry point is the sidebar, as this is used for all of the main navigation on the product.

### Event Manager

```mermaid
flowchart LR
  A[Sidebar] --> B[Team Dropdown]
  B --> C[Team Details]
  C --> D[Update Team Information Form]
  B -->|Manage Members| E[Manage Members & Add Member]
  B -->|Add Member| E
  B --> F[Create Team Form]
  A -->|Team Details| C
  A -->|Manage Members| E
  A -->|Events| F[Events List]
  A -->|Draft Events| G[Draft Events List]
  F -->|Host an Event| H[Create Event Form]
  G -->|Host an Event| H
  F -->|Edit| I[Edit Event Form]
  G -->|Edit| I
  F -->|Delete| J[Delete Event Confirmation]
  G -->|Delete| J
  F -->|Details| K[Event Details]
  F -->|Stats| L[Tickets List]
  L -->|Ticket Store| M[Opens Event Portal]
  G -->|Checkout| N[Event Checkout]
```

### Account Manager

```mermaid
flowchart LR
  A[Sidebar] --> B[Change Password]
  A --> C[Manage Emails]
```

### Navbar

There is another entry point - the navbar, and this mainly leads to pages in the account manager from the user dropdown.

```mermaid
flowchart LR
  A[Navbar] --> B[User Dropdown]
  B --> C[Change Password]
  B --> D[Manage Emails]
  B --> E[Sign Out]
  A -->|Go to Home| F[Event Discovery]
```
