FROM python:3.10-bullseye

ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=config.settings.local

WORKDIR /code/

# python setup
COPY config/requirements/local.txt /code/local.txt
COPY config/requirements/_code_quality.txt /code/_code_quality.txt
COPY config/requirements/base.txt /code/base.txt

RUN pip install --upgrade pip
RUN pip install -r local.txt

# django setup
COPY . /code