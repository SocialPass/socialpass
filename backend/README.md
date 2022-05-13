# SocialPass - Django
SocialPass Django application

Contains core API, business logic, and database schema

# Documentation
https://www.notion.so/Backend-Django-54edff9f8bcf4bc49483caa6d46a7d96

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

## Requirements
Python3+ and local Postgres titled 'v3db'

## Initial Setup
Clone Repo
`git clone git@github.com:nftylabs/v3.git`
`cd v3/django`

## Setup Virual Environment
`python3 -m venv venv`
`source venv/bin/activate`

## Upgrade pip (if necessary)
`pip3 install --upgrade pip`

## Install Requirements
`pip3 install -r config/requirements/local.txt`

## Create Database
In a different terminal window:\
Run virtual environment `source venv/bin/activate`\
Run postgress `psql`\
Create database `CREATE DATABASE v3db;`

## Start Server
Run server `python3 manage.py runserver`

## Apply migrations
Go back to the first terminal window and run `python manage.py migrate`

# Deployment
The following details how to deploy this application.

## Heroku
See detailed [cookiecutter-django Heroku documentation](http://cookiecutter-django.readthedocs.io/en/latest/deployment-on-heroku.html).
