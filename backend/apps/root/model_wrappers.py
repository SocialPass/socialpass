import uuid

from django.db import models
from model_utils.models import TimeStampedModel


class DBModel(TimeStampedModel):
    """
    Abstract base model that provides useful timestamps.
    """

    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)

    class Meta:
        abstract = True
