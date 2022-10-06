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

# System Architecture

![NFTY Labs - System Architecture](https://user-images.githubusercontent.com/5043263/190167231-c711b042-05bf-4fe6-8ca3-308ab73163d3.jpg)

# Database ERD

![NFTY - Social Pass (1)](https://user-images.githubusercontent.com/5043263/190185065-8f8eab59-72f4-4ea7-b27c-31ca8df0bd5e.png)
[DBdiagram.io](https://dbdiagram.io/d/630cf1010911f91ba5ec1101)

# Infrastructure

![NFTY Labs - Infrastructure diagram (1)](https://user-images.githubusercontent.com/5043263/190232728-6f39d60b-b8e0-4c74-9d94-2e38a41ad8e3.jpg)

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

# Getting Started
## Contributions
1. Branches opened for PR with relevant reviewer requested
2. PR passes all checks
2. PR reviewed
3. PR merged into `master`

Branches should be prefixed matching their corresponding GH label and a brief description of the issue at hand.
- `minor/*`
- `major/*`
- `refactor/*`

## Clone repo
```bash
git clone git@github.com:nftylabs/socialpass.git
cd socialpass
```

## Run with docker and docker-compose
```bash
# Build Containers
make build

# Run Migrations (if necessary)
make migrate

# Run Containers
make up
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

# Run postgres image
# Alternatively, running a postgres server locally also works
docker run -d --name database -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -v /data:/var/lib/postgresql/data postgres

# Run Migrations (if necessary)
python backend/manage.py migrate

# Run application
python backend/manage.py runserver


```

```bash
## EXTRA COMMANDS
# To stop postgres container
docker stop database

# To start postgres container
docker start database

# pre-populate database
# possible prefixes = --events (number of events), --tickets (number of tickets) and --user-default (create or not dummy user)
python backend/manage.py populate_db --events 1 --tickets 1

# clear database
python backend/manage.py reset_db
python backend/manage.py migrate

```
