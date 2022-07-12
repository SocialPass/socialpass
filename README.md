# SocialPass
Welcome to SocialPass! If you're reading this, you've found yourself in a great place.

# Getting Started
The root-level [Makefile](Makefile) is used to jumpstart local development.
To get started, please follow the directions below:

## Setup development environment (if possible)
`python3 -m venv venv`
`source venv/bin/activate`
`pre-commit install`

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
