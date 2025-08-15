web: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
worker: python manage.py procrastinate worker
release: python manage.py migrate && python manage.py collectstatic --noinput
