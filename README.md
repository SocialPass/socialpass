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

# Clone repo
```bash
$ git clone git@github.com:nftylabs/socialpass.git
$ cd socialpass
```

# Run with docker and docker-compose
```bash
# Build Containers
$ make build

# Run Migrations (if necessary)
$ make migrate

# Run Containers
$ make up
```

# Run with pyenv

```bash
# Install python 3.10.5 version
$ pyenv install 3.10.5

# Make python version local or global
$ pyenv local 3.10.5
$ pyenv global 3.10.5

# Verify version
$ python --version

# Create a virtual enviroment for the application
$ pyenv virtualenv 3.10.5 socialpass
$ pyenv activate socialpass

# Install development dependencies
$ pip install -r backend/config/requirements/local.txt

# Run postgres image 
$ docker run -d --name database -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -v /data:/var/lib/postgresql/data postgres

# Run Migrations (if necessary)
$ python backend/manage.py migrate

# Compress staticfiles (if necessary)
$ python backend/manage.py compress --force

# Run application
$ python backend/manage.py runserver
```

```bash
## EXTRA COMMANDS
# To stop postgres container
$ docker stop database

# To start postgres container
$ docker start database
```



# Contributions
1. Branches opened for PR with relevant reviewer requested
2. PR passes all checks
2. PR reviewed
3. PR merged into `master`

Once merged, `master`, can be pushed directly to either `staging` or `master`.
This will trigger CI/CD pipelie for the respective environments.

Branches should be prefixed matching their corresponding GH label and a brief description of the issue at hand.
- `minor/*`
- `major/*`
- `refactor/*`

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


