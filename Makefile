SHELL := /bin/bash

#
# VENV COMMANDS
#
help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

lint: ## Lint backend repo
	(source backend/venv/bin/activate; cd backend; black .; isort .; flake8 .; mypy .;)

collect: ## collectstatic backend
	(source backend/venv/bin/activate; cd backend; ./manage.py collectstatic --no-input)

install: ## Create backend migrations
	(source backend/venv/bin/activate; cd backend; pip3 install -r config/requirements/local.txt)

migration: ## Create backend migrations
	(source backend/venv/bin/activate; cd backend; ./manage.py makemigrations)

migrate: ## Migrate backend migrations
	(source backend/venv/bin/activate; cd backend; ./manage.py migrate)

populate: ## Populate DB
	(source backend/venv/bin/activate; cd backend; ./manage.py populate_db)

reset: ## Create backend superuser
	(source backend/venv/bin/activate; cd backend; ./manage.py reset_db)

run: ## Create backend superuser
	(source backend/venv/bin/activate; cd backend; ./manage.py runserver)

superuser: ## Create backend superuser
	(source backend/venv/bin/activate; cd backend; ./manage.py createsuperuser)

test: ## Test backend repo
	(source backend/venv/bin/activate; cd backend; ./manage.py test --settings=config.settings.test)

turtle: ## backend shell plus
	(source backend/venv/bin/activate; cd backend; ./manage.py shell_plus)

#
# DOCKER COMMANDS
#
docker-build: ## docker build
	docker-compose build

docker-clean: ## docker build
	docker-compose build --no-cache

docker-collect: ## collectstatic backend
	docker-compose run web python backend/manage.py collectstatic --no-input

docker-migration: ## Create backend migrations
	docker-compose run web python backend/manage.py makemigrations

docker-migrate: ## Migrate backend migrations
	docker-compose run web python backend/manage.py migrate

docker-nuke: ## BEWARE. THIS WILL DESTROY ALL DOCKER IMAGES AND CONTAINERS ON HOST MACHINE
	docker rmi -f $(docker images -aq) && docker rm -vf $(docker ps -aq)

docker-populate: ## Populate DB
	docker-compose run web python backend/manage.py populate_db

docker-superuser: ## Create backend superuser
	docker-compose run web python backend/manage.py createsuperuser

docker-test: ## Test backend repo
	docker-compose run web python backend/manage.py test --settings=config.settings.test

docker-turtle: ## backend shell plus
	docker-compose run web python backend/manage.py shell_plus

docker-up: ## docker up
	docker-compose up