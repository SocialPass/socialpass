SHELL := /bin/bash

# python (backend x fastapi)
help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

test: ## Test backend repo (backend/venv)
	(source backend/venv/bin/activate; cd backend && python manage.py test --failfast)

lint: ## Lint backend repo (backend/venv)
	(source backend/venv/bin/activate; cd backend; black .; isort .; flake8 .; mypy .;)

maction: ## Test github actions (requires `act` to be installed, also has flag for M1)
	act pull_request --container-architecture linux/amd64

nukedocker: ## BEWARE. THIS WILL DESTROY ALL DOCKER IMAGES AND CONTAINERS ON HOST MACHINE (unix only)
	docker rmi -f $(docker images -aq) && docker rm -vf $(docker ps -aq)

build: ## docker build (docker)
	docker-compose build

cleanbuild: ## docker build (docker)
	docker-compose build --no-cache

up: ## docker up (docker)
	docker-compose up

collect: ## collectstatic backend (docker)
	docker-compose run web python backend/manage.py collectstatic --no-input

migration: ## Create backend migrations (docker)
	docker-compose run web python backend/manage.py makemigrations

migrate: ## Migrate backend migrations (docker)
	docker-compose run web python backend/manage.py migrate

compress: ## Compress backend staticfiles (docker)
	docker-compose run web python backend/manage.py compress --force

superuser: ## Create backend superuser (docker)
	docker-compose run web python backend/manage.py createsuperuser

turtle: ## backend shell plus (docker)
	docker-compose run web python backend/manage.py shell_plus

prepopulate:
	docker-compose run web python backend/manage.py pre-populate-db

resetdb:
	docker-compose run web python backend/manage.py clear-db