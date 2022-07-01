SHELL := /bin/bash

# python (backend x fastapi)
help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

collect: ## collectstatic backend
	docker-compose run web python backend/manage.py collectstatic --no-input

migration: ## Create backend migrations
	docker-compose run web python backend/manage.py makemigrations

migrate: ## Migrate backend migrations
	docker-compose run web python backend/manage.py migrate

up: ## Create && migrate
	docker-compose run web python backend/manage.py makemigrations; docker-compose run web python backend/manage.py migrate;

superuser: ## Create backend superuser
	docker-compose run web python backend/manage.py createsuperuser

turtle: ## backend shell plus
	docker-compose run web python backend/manage.py shell_plus

lint: ## Lint backend repo
	(source venv/bin/activate; black .; isort .; flake8 .;)

test: ## Test backend repo
	docker-compose run web python backend/manage.py test
