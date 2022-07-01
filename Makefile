SHELL := /bin/bash

# python (backend x fastapi)
help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

create: ## Create virtual environment
	python3.10 -m venv venv

setup: ## Install backend requirements
	(source venv/bin/activate; \
	pip3 install --upgrade pip; \
	pip3 install -r config/requirements/local.txt; \
	pre-commit install;)

collect: ## collectstatic backend
	(source venv/bin/activate; python3.10 manage.py collectstatic --no-input)

run: ## Start backend server
	(source venv/bin/activate; python3.10 manage.py runserver)

migration: ## Create backend migrations
	(source venv/bin/activate; python3.10 manage.py makemigrations)

migrate: ## Migrate backend migrations
	(source venv/bin/activate; python3.10 manage.py migrate)

up:: ## Create && migrate
	(source venv/bin/activate; python3.10 manage.py makemigrations;python3.10 manage.py migrate)

superuser: ## Create backend superuser
	(source venv/bin/activate; python3.10 manage.py createsuperuser)

turtle: ## backend shell plus
	(source venv/bin/activate; python3.10 manage.py shell_plus)

lint: ## Lint backend repo
	(source venv/bin/activate; black .; isort .; flake8 .;)

test: ## Test backend repo
	(source venv/bin/activate; python3.10 manage.py test apps/)
