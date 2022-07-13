<p align="center">
<img align="center" width="169" height="169" src="https://res.cloudinary.com/nfty-labs/image/upload/v1652735850/SocialPass-Icon_eanblz.svg"/>
</p>

# SocialPass

SocialPass provides end-to-end event organization software aimed at the next generation of events.

This monorepo contains the following pieces of software
- Organizer Dashboard (`backend/dashboard`)
- Event Discovery (`backend/dashboard`)
- Ticket Scanner (`frontend/scanner-app`)
- Checkout Portal (`frontend/eventportal`)


# Before Jumping In
As mentioned above, SocialPass is all about events and Web3. If you're not familiar with either yet, the resources below are a great way to start:

### Event Resources
- https://www.eventbrite.com/blog/press/press-releases/eventbrite-acquires-london-based-lanyrd-and-latin-american-events-company-eventioz/
- https://www.infoworld.com/article/2362947/expert-interview-how-to-scale-django.amp.html

### Web3 Resources
- url
- url


# Getting Started
A root-level [Makefile](Makefile) exists to jumpstart local development. The guide below will reference these makefile commands.

Again, any additions here to hasten development are always welcome

Clone repo
- `git clone git@github.com:nftylabs/socialpass.git`
- `cd socialpass`

### Setup development environment (if possible)
- `python3 -m venv venv`
- `source venv/bin/activate`
- `pre-commit install`

### Build Containers
`make build`

### Run Migrations (if necessary)
`make migrate`

### Run Containers
`make up`

# Backend

### Root (`root`)
### Organizer Dashboard (`dashboard`)
### Event Discovery (`event_discovery`)
### Checkout Portal (`api_checkoutportal`)
### Scanner (`api_scanner`)
### Avoid Form Resubmission (`avoid_form_resubmission`)


# Frontend
### Event Portal (`eventportal`)
### Scanner (`scanner-app`)
