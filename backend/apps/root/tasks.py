# Create celery tasks here
from celery import shared_task


@shared_task
def sum(x: int, y: int) -> int:
    return x + y
