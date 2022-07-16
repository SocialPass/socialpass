<p align="center">
<img align="center" width="169" height="169" src="https://res.cloudinary.com/nfty-labs/image/upload/v1652735850/SocialPass-Icon_eanblz.svg"/>
</p>

# SocialPass
SocialPass provides end-to-end event organization software aimed at the next generation of events.


# Before Jumping In
As mentioned above, SocialPass is all about events and Web3. If you're not familiar with either yet, the resources below are a great way to start:

### Event Resources
- https://www.eventbrite.com/blog/press/press-releases/eventbrite-acquires-london-based-lanyrd-and-latin-american-events-company-eventioz/
- https://www.infoworld.com/article/2362947/expert-interview-how-to-scale-django.amp.html

### Web3 Resources
- url
- url


# Getting Started
A root-level [Makefile](Makefile) exists to jumpstart local development.
The guide below will reference these makefile commands.

Again, any additions here to hasten development are always welcome

### Clone repo
`git clone git@github.com:nftylabs/socialpass.git`

`cd socialpass`

### Build Containers
`make build`

### Run Migrations (if necessary)
`make migrate`

### Run Containers
`make up`

# Contributions
1. Branches opened for PR with relevant reviewer requested
2. PR passes all checks
2. PR reviewed
3. PR merged into `master`

Once merged, `master`, can be pushed directly to either `staging` or `master`.
This will trigger CI/CD pipelie for the respective environments.

Notes: Branches should be prefixed with the following labels
- `refactor/*`
- `fix/*`
- `feature/*`

# Backend
## Root
Located at `backend/apps/root`


## Organizer Dashboard
Located at `backend/apps/dashboard`


## Event Discovery
Located at `backend/apps/event_discovery`


## Checkout Portal
Located at `backend/apps/api_checkoutportal`


## Scanner
Located at `backend/apps/api_scanner`


## Avoid Form Resubmission
Located at `backend/apps/avoid_form_resubmission`


# Frontend
## Event Portal
Located at `frontend/eventportal`


## Scanner
Located at `frontend/scanner-app`


