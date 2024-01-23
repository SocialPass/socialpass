<p align="center">
<img align="center" width="169" height="169" src="https://res.cloudinary.com/nfty-labs/image/upload/v1652735850/SocialPass-Icon_eanblz.svg"/>
</p>

# SocialPass
SocialPass provides end-to-end event organization software aimed at the next generation of events.

[![Django CI](https://github.com/SPTech-Group/socialpass/actions/workflows/django.yml/badge.svg)](https://github.com/SPTech-Group/socialpass/actions/workflows/django.yml)
[![Checkout App CI](https://github.com/SPTech-Group/socialpass/actions/workflows/eventportal.yml/badge.svg)](https://github.com/SPTech-Group/socialpass/actions/workflows/eventportal.yml)
[![Scanner App CI](https://github.com/SPTech-Group/socialpass/actions/workflows/scanner-app.yml/badge.svg)](https://github.com/SPTech-Group/socialpass/actions/workflows/scanner-app.yml)

# System Overview
# System Architecture
![NFTY Labs - System Architecture](https://user-images.githubusercontent.com/5043263/190167231-c711b042-05bf-4fe6-8ca3-308ab73163d3.jpg)

## Infrastructure
![NFTY Labs - Infrastructure diagram (1)](https://user-images.githubusercontent.com/5043263/190232728-6f39d60b-b8e0-4c74-9d94-2e38a41ad8e3.jpg)

## Database ERD
[DBdiagram.io](https://dbdiagram.io/d/6321f1240911f91ba5ae16a2)

# Domains
## Testing
- Django App: https://demo-socialpass.nftytesting.com
- Checkout App: https://demo-checkout.nftytesting.com
- Scanner App: https://demo-scanner.nftytesting.com

## Production
- Django App: https://socialpass.io
- Checkout App: https://checkout.socialpass.io
- Scanner App: https://scanner.socialpass.io


# Getting Started
## Contributions
1. Branches opened for PR with relevant reviewer requested
2. PR passes all checks
2. PR reviewed
3. PR merged into `master`

Once merged, `master`, can be pushed directly to either `staging` or `master`.
This will trigger CI/CD pipeline for the respective environments.

Branches should be prefixed matching their corresponding GH label and a brief description of the issue at hand.
- `minor/*`
- `major/*`
- `refactor/*`
- `bug/*`


## Clone repo
```bash
git clone git@github.com:nftylabs/socialpass.git
cd socialpass
```

## Run with pyenv
```bash
# Install python 3.10.5 version
pyenv install 3.10.5

# Make python version local or global
pyenv local 3.10.5
pyenv global 3.10.5

# Optional: Depending on your OS, you may need to run the following to activate pyenv
eval "$(pyenv init -)"

# Verify version
python --version

# Create a virtual enviroment for the application
pyenv virtualenv 3.10.5 socialpass
pyenv activate socialpass

# Install development dependencies
pip install -r backend/config/requirements/local.txt

# Run Postgres server locally and create database with creds from settings
...

# Run Migrations (if necessary)
python backend/manage.py migrate

# Run application
python backend/manage.py runserver


```

```bash
## EXTRA COMMANDS

# pre-populate database
# possible prefixes = --events (number of events), --tickets (number of tickets) and --user-default (create or not dummy user)
python backend/manage.py populate_db --events 1 --tickets 1

# clear database
python backend/manage.py reset_db
python backend/manage.py migrate

```
