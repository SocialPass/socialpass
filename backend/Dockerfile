FROM python:3.10-alpine

ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=config.settings.local

WORKDIR /code/

# system installations
RUN apk update \
  && apk add --virtual build-deps build-base gcc python3-dev musl-dev libffi-dev \
  && apk add postgresql-dev \
  && pip install -U setuptools pip

# python setup
COPY config/requirements/local.txt /code/local.txt
COPY config/requirements/base.txt /code/base.txt
RUN pip install -r local.txt

# django setup
COPY . /code