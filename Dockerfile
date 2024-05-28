FROM python:3.10-bullseye

ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=config.settings.production

WORKDIR /code/

# python setup
COPY config/requirements/production.txt /code/production.txt
COPY config/requirements/base.txt /code/base.txt

RUN pip install --upgrade pip
RUN pip install -r production.txt

# django setup
COPY . /code