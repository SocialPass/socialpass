SHELL := /bin/bash

# python (backend x fastapi)
help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

py-create: ## Create virtual environment
	python3 -m venv venv

# backend
backend-setup: ## Install backend requirements
	(source venv/bin/activate; \
	pip3 install --upgrade pip; \
	pip3 install -r config/requirements/local.txt; )

backend-collect: ## collectstatic backend
	(source venv/bin/activate; python3 manage.py collectstatic --no-input)

backend-run: ## Start backend server
	(source venv/bin/activate; python3 manage.py runserver)

backend-migration: ## Create backend migrations
	(source venv/bin/activate; python3 manage.py makemigrations)

backend-migrate: ## Migrate backend migrations
	(source venv/bin/activate; python3 manage.py migrate)

backend-up:: ## Create && migrate
	(source venv/bin/activate; python3 manage.py makemigrations;python3 manage.py migrate)

backend-superuser: ## Create backend superuser
	(source venv/bin/activate; python3 manage.py createsuperuser)

backend-turtle: ## backend shell plus
	(source venv/bin/activate; python3 manage.py shell_plus)

backend-lint: ## Lint backend repo
	(source venv/bin/activate; black .; isort .; flake8 .;)

backend-test: ## Lint backend repo
	(source venv/bin/activate; python3 manage.py test apps/services)
