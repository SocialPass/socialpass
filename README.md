# Welcome to SocialPass
![SocialPass Logo](https://res.cloudinary.com/nfty-labs/image/upload/v1652735850/SocialPass-Icon_eanblz.svg)
Welcome to SocialPass! If you're reading this, you've found yourself in a great place to be a builder.

SocialPass is all about events and Web3. If you're not familiar with either yet, the resources below are a great way to start:

## Event Resources
- https://www.eventbrite.com/blog/press/press-releases/eventbrite-acquires-london-based-lanyrd-and-latin-american-events-company-eventioz/
- https://www.infoworld.com/article/2362947/expert-interview-how-to-scale-django.amp.html

## Web3 Resources
-

Additions are always encouraged here! Staying on top of certain trends, topic, etc. is very important here, and in the blockchain space in general.

Now that's out the way, it's safe to get started

# Getting Started
A root-level [Makefile](Makefile) exists to jumpstart local development. The guide below will reference these makefile commands.

Again, any additions here to hasten development are always welcome

## Clone repo
- `git clone git@github.com:nftylabs/socialpass.git`
- `cd socialpass`

## Setup development environment (if possible)
- `python3 -m venv venv`
- `source venv/bin/activate`
- `pre-commit install`

## Build Containers
`make build`

## Run Migrations (if necessary)
`make migrate`

## Run Containers
`make up`

# Backend
## Backend Style Guide
- Fat models, thin views & thin forms
- All views should have accompanying test(s)
-

## API Checkout Portal (`api_checkoutportal`)
## API Scanner (`api_scanner`)
## Avoid Form Resubmission (`avoid_form_resubmission`)
## Organizer Dashboard (`dashboard`)
## Event Discovery (`event_discovery`)
## Root (`root`)

# Frontend
## Frontend Style Guide
- Scaffold new projects with Vite (https://vitejs.dev)
- Prefer Yarn over NPM
- Prefer basic CSS over CSS-in-JS or anything of the like (tailwind, etc.)

## Event Portal (eventportal)
## Scanner (scanner-app)
