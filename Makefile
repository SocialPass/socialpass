SHELL := /bin/bash

# python (django x fastapi)
help:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

py-create:
	python3 -m venv venv

py-setup:
	(source venv/bin/activate; \
	pip3 install --upgrade pip; \
	pip3 install -r django/config/requirements/local.txt; \
	pip3 install -r services/requirements.txt; )

py-start:
	(source venv/bin/activate; \
	cd services && uvicorn main:app --reload --port 8080 & \
	cd django && python3 manage.py runserver)

py-lint:
	(source venv/bin/activate; black django; isort django; flake8 django;\
	black services; isort services; flake8 services;)



# django
django-setup:
	setup:
	(source venv/bin/activate; \
	pip3 install --upgrade pip; \
	pip3 install -r django/config/requirements/local.txt; )

django-run:
	python3 manage.py runserver

django-migration:
	python3 manage.py makemigrations

django-migrate:
	python3 manage.py migrate

django-superuser:
	python3 manage.py createsuperuser

django-lint:
