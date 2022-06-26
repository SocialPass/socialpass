# SocialPass - backend
SocialPass backend monolith, written in python / django.
Contains core API, business logic, and database schema, subdivided into traditional django 'apps'.

# Overview
Below is a breakdown of the current app layout.
Note: Each app should have its own set of dedicated tests (integration and/or unit, depending on the scenario)

## `root`
- Core database models

## `dashboard`
- Event organizer dashboard models
- Event organizer dashboard views (HTML)

## `api_scanner`
- No models
- Ticket scanner views (DRF)

## `api_checkoutportal`
- No models
- Checkout portal views (DRF)

# Contribution Notes
- Install pre-commit hooks for linting and typechecking (https://pre-commit.com/#install)
- Small Views, Medium Models, Large Services
	- Views should reference services or models
	- Models should have DB schema and associated properties (@property)
	- Services should contain all other business logic
	- This as fallback reference: https://github.com/HackSoftware/Django-Styleguide

# Local Development (Docker)

## Initial Setup
Clone Repo
`git clone git@github.com:nftylabs/socialpass.git`
`cd socialpass/backend`

## Apply migrations
`docker-compose run web python manage.py migrate`

## Start Server
`docker-compose up`

# Local Development
Details on local development
Additionally, there is a root-level `Makefile` that should jumpstart local non-dockerized development
## Requirements
Python3+ and local Postgres titled 'socialpass'

## Initial Setup
Clone Repo
`git clone git@github.com:nftylabs/socialpass.git`
`cd socialpass/backend`

## Setup Virual Environment
`python3 -m venv venv`
`source venv/bin/activate`

## Upgrade pip (if necessary)
`pip3 install --upgrade pip`

## Install Requirements and Setup Environment
`pip3 install -r config/requirements/local.txt`
`pre-commit install`

## Create Database
In a different terminal window:\
Run virtual environment `source venv/bin/activate`\
Run postgress `psql`\
Create database `CREATE DATABASE socialpass;`

## Start Server
Run server `python3 manage.py runserver`

## Apply migrations
Go back to the first terminal window and run `python3 manage.py migrate`

# Deployment
The following details how to deploy this application.

## Heroku
See detailed [cookiecutter-django Heroku documentation](http://cookiecutter-django.readthedocs.io/en/latest/deployment-on-heroku.html).
