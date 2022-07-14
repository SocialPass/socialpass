SHELL := /bin/bash

# python (backend x fastapi)
help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

build: ## docker build (docker)
	docker-compose build

buildclean: ## docker build (docker)
	docker-compose build --no-cache

up: ## docker up (docker)
	docker-compose up

collect: ## collectstatic backend (docker)
	docker-compose run web python backend/manage.py collectstatic --no-input

migration: ## Create backend migrations (docker)
	docker-compose run web python backend/manage.py makemigrations

migrate: ## Migrate backend migrations (docker)
	docker-compose run web python backend/manage.py migrate

superuser: ## Create backend superuser (docker)
	docker-compose run web python backend/manage.py createsuperuser

turtle: ## backend shell plus (docker)
	docker-compose run web python backend/manage.py shell_plus

lint: ## Lint backend repo (backend/venv)
	(source backend/venv/bin/activate; black .; isort .; flake8 .;)

test: ## Test backend repo (backend/venv)
	(source backend/venv/bin/activate; cd backend && python manage.py test --failfast)

maction: ## Test github actions (requires `act` to be installed, also has flag for M1)
	act --container-architecture linux/amd64
