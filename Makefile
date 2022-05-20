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
	pip3 install -r backend/config/requirements/local.txt; )

backend-run: ## Start backend server
	(source venv/bin/activate; python3 backend/manage.py runserver)

backend-migration: ## Create backend migrations
	(source venv/bin/activate; python3 backend/manage.py makemigrations)

backend-migrate: ## Migrate backend migrations
	(source venv/bin/activate; python3 backend/manage.py migrate)

backend-up:: ## Create && migrate
	(source venv/bin/activate; python3 backend/manage.py makemigrations;python3 backend/manage.py migrate)

backend-superuser: ## Create backend superuser
	(source venv/bin/activate; python3 backend/manage.py createsuperuser)

backend-turtle: ## backend shell plus
	(source venv/bin/activate; python3 backend/manage.py shell_plus)

backend-lint: ## Lint backend repo
	(source venv/bin/activate; cd backend; black .; isort .; flake8 .;)


# frontend
frontend-setup: ## install js requirements
	cd frontend && yarn;
