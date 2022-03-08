SHELL := /bin/bash

# python (django x fastapi)
help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

py-create: ## Create virtual environment
	python3 -m venv venv

py-setup: ## Install django ++ fastapi requirements
	(source venv/bin/activate; \
	pip3 install --upgrade pip; \
	pip3 install -r django/config/requirements/local.txt; \
	pip3 install -r services/requirements.txt; )

py-run: ## Start django ++ fastapi server
	(source venv/bin/activate; \
	cd services && uvicorn main:app --reload --port 8080 & \
	cd django && python3 manage.py runserver)

py-lint: ## Lint django ++ fastapi
	(source venv/bin/activate; black django; isort django; flake8 django;\
	black services; isort services; flake8 services;)



# django
django-setup: ## Install django requirements
	(source venv/bin/activate; \
	pip3 install --upgrade pip; \
	pip3 install -r django/config/requirements/local.txt; )

django-run: ## Start django server
	(source venv/bin/activate; python3 django/manage.py runserver)

django-migration: ## Create django migrations
	(source venv/bin/activate; python3 django/manage.py makemigrations)

django-migrate: ## Migrate django migrations
	(source venv/bin/activate; python3 django/manage.py migrate)

django-up:: ## Create && migrate
	(source venv/bin/activate; python3 django/manage.py makemigrations;python3 django/manage.py migrate)

django-superuser: ## Create django superuser
	(source venv/bin/activate; python3 django/manage.py createsuperuser)


# fastapi
fast-setup: ## Install fastapi requirements
	(source venv/bin/activate; \
	pip3 install --upgrade pip; \
	pip3 install -r services/requirements.txt; )

fast-run: ## Install fastapi requirements
	(source venv/bin/activate; cd services && uvicorn main:app --reload --port 8080)


# git
git-master: ## push to master
	git push origin master

git-staging: ## push staging to master
	git push origin master:staging
