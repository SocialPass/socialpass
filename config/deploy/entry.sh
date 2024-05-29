#!/usr/bin/env bash

set -e

if [ "$1" == "web" ]; then
  echo "Applying migrations"
  python manage.py migrate

  echo "Running production server"
  exec gunicorn -c config/gunicorn.py $@
elif [ "$1" == "scheduler" ]; then
  shift
  exec celery -A app beat -l info $@
elif [ "$1" == "worker" ]; then
  shift
  exec celery -A app worker -l info $@
elif [ "$1" == "manage" ]; then
  shift
  exec python manage.py $@
else
	exec "$@"
fi