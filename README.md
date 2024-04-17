<div align="center">
<img align="center" width="169" height="169" src="https://res.cloudinary.com/nfty-labs/image/upload/v1652735850/SocialPass-Icon_eanblz.svg"/>
</div>

# SocialPass
SocialPass provides end-to-end event organization software aimed at the next generation of events.

# Overview
The core of SocialPass consists of three parts:

1. Organizer dashboard - Used by organizers to create and manage events
2. Checkout - Used by attendees to get tickets for events
3. Scanner - Used by organizers to check-in users by scanning the attendees' tickets

# Local Development Guide

## With pyenv

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
# Example using: https://postgresapp.com/
psql
create database local_socialpass_db;

# Run migrations (if necessary)
python backend/manage.py migrate

# Run application
make run

```

## With regular Python 3 

If you have a fairly latest version of Python 3 installed on your machine, you can just directly create a virtual environment and start SocialPass that way. All the instructions above (after the pyenv) section will still apply in such a case:

```bash
# Create a virtual enviroment for the application
virtualenv -p python3 venv
source venv/bin/activate

# Install development dependencies
pip install -r backend/config/requirements/local.txt

# Run Postgres server locally and create database with creds from settings
# Example using: https://postgresapp.com/
psql
create database local_socialpass_db;

# Run migrations (if necessary)
python backend/manage.py migrate

# Run application
make run

```

## For Mac M1

There is a weird issue on Mac M1s that stems from the `cryptography` package. In order to get SocialPass running on your M1, please follow these instructions:

1. Remove `git+https://github.com/SocialPass/passbook.git@7a3614e974c1862a24e7b02ced11313c8320c14b` from `backend/config/requirements/base.txt` and uninstall the package in your environment
2. Install `pip install git@github.com:devartis/passbook.git` instead
3. Install Homebrew: https://brew.sh/
4. Install M2Crypto using the following instructions:
```bash
brew install openssl swig
LDFLAGS="-L$(brew --prefix openssl)/lib" CFLAGS="-I$(brew --prefix openssl)/include" SWIG_FEATURES="-I$(brew --prefix openssl)/include" pip install m2crypto
```

After that, you should be able to run your migrations and start the app.

# Style Guide (Linting / Formatting)

Please always run the following commands to lint and format your codebase to make sure your PR passes the checks:

```bash
make lint
make format
```

# Contribution Guide
1. Branches opened for PR with relevant reviewer requested
2. PR passes all checks
2. PR reviewed
3. PR merged into `master` or whatever is the working base at that moment

Once merged, `master`, can be pushed directly to either `staging` or `production`.
This will trigger CI/CD pipeline for the respective environments.

Branches should be prefixed matching their corresponding GH label and a brief description of the issue at hand.
- `minor/*`
- `major/*`
- `refactor/*`
- `bug/*`

---
© 2024, SocialPass. All rights reserved
