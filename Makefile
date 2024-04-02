SHELL := /bin/bash

#
# VENV COMMANDS
#
help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

format: ## Format codebase
	(source backend/venv/bin/activate; cd backend; ruff format .; djlint . --reformat;)

lint: ## Lint codebase
	(source backend/venv/bin/activate; cd backend; ruff check .; mypy .; djlint . --lint;)

collect: ## collectstatic backend
	(source backend/venv/bin/activate; cd backend; yarn; npx webpack --config webpack.config.js --progress; ./manage.py collectstatic --no-input)

install: ## Install requirements
	(source backend/venv/bin/activate; cd backend; pip3 install -r config/requirements/local.txt)

migration: ## Create backend migrations
	(source backend/venv/bin/activate; cd backend; ./manage.py makemigrations)

migrate: ## Migrate backend migrations
	(source backend/venv/bin/activate; cd backend; ./manage.py migrate)

populate: ## Populate DB
	(source backend/venv/bin/activate; cd backend; ./manage.py populate_db)

reset: ## Reset Database
	(source backend/venv/bin/activate; cd backend; ./manage.py reset_db)

run: ## Run Backend Server
	(source backend/venv/bin/activate; cd backend; ./manage.py procrastinate worker & ./manage.py runserver)

superuser: ## Create backend superuser
	(source backend/venv/bin/activate; cd backend; ./manage.py createsuperuser)

test: ## Test codebase
	(source backend/venv/bin/activate; cd backend; ./manage.py test --settings=config.settings.test --failfast)

turtle: ## Run shell_plus
	(source backend/venv/bin/activate; cd backend; ./manage.py shell_plus)