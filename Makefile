SHELL := /bin/bash

#
# VENV COMMANDS
#
help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

format: ## Format codebase
	(source venv/bin/activate; ruff format .; djhtml .;)

lint: ## Lint codebase
	(source venv/bin/activate; ruff check .; mypy .;)

collect: ## collectstatic backend
	(source venv/bin/activate; yarn; npx webpack --config webpack.config.js --progress; ./manage.py collectstatic --no-input)

install: ## Install requirements
	(source venv/bin/activate; pip3 install -r config/requirements/local.txt)

migration: ## Create backend migrations
	(source venv/bin/activate; ./manage.py makemigrations)

migrate: ## Migrate backend migrations
	(source venv/bin/activate; ./manage.py migrate)

populate: ## Populate DB
	(source venv/bin/activate; ./manage.py populate_db)

reset: ## Reset Database
	(source venv/bin/activate; ./manage.py reset_db)

run: ## Run Backend Server
	(source venv/bin/activate; ./manage.py procrastinate worker & ./manage.py runserver)

superuser: ## Create backend superuser
	(source venv/bin/activate; ./manage.py createsuperuser)

test: ## Test codebase
	(source venv/bin/activate; ./manage.py test --settings=config.settings.test --failfast)

turtle: ## Run shell_plus
	(source venv/bin/activate; ./manage.py shell_plus)