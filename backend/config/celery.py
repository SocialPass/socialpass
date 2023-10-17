import os

from celery import Celery
from config.NFTYTicketGenerator import generate_ticket

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')

app = Celery('proj')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self):
	print(f'Request: {self.request!r}')


@app.task(bind=True)
def gen(self):
	return generate_ticket(
		{
		"name": "test",
		"gate_limit": "test",
		"date": "test",
		"location": "test"
		},
		{}
	)
