SHELL := /bin/bash

# python (backend x fastapi)
help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

py-create: ## Create virtual environment
	python3 -m venv venv

py-setup: ## Install backend ++ fastapi requirements
	(source venv/bin/activate; \
	pip3 install --upgrade pip; \
	pip3 install -r backend/config/requirements/local.txt; \
	pip3 install -r services/requirements.txt; )

py-run: ## Start backend ++ fastapi server
	(source venv/bin/activate; \
	cd services && uvicorn main:app --reload --port 8080 & \
	cd backend && python3 manage.py runserver)

py-lint: ## Lint backend ++ fastapi
	(source venv/bin/activate; black backend; isort backend; flake8 backend;\
	black services; isort services; flake8 services;)



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


# fastapi
fast-setup: ## Install fastapi requirements
	(source venv/bin/activate; \
	pip3 install --upgrade pip; \
	pip3 install -r services/requirements.txt; )

fast-run: ## Install fastapi requirements
	(source venv/bin/activate; cd services && uvicorn main:app --reload --port 8080)

fast-lint: ## Lint fastapi
	(source venv/bin/activate; black services; isort services; flake8 services;)


# frontend
frontend-setup: ## install js requirements
	cd frontend && yarn;

frontend-run: ## Start backend ++ fastapi server
	cd frontend && yarn start & \
	cd frontend && yarn storybook
