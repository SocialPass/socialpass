from django.conf import settings
from django.utils.module_loading import import_string
from storages.backends.s3boto3 import S3Boto3Storage


class MediaRootS3Boto3Storage(S3Boto3Storage):
    location = "public/media"
    default_acl = "public-read"
    file_overwrite = False
    custom_domain = False


class PrivateTicketStorage(S3Boto3Storage):
    location = "private/tickets"
    default_acl = "private"
    file_overwrite = False
    custom_domain = False


def get_private_ticket_storage():
    private_storage_class = import_string(settings.PRIVATE_TICKET_STORAGE)
    return private_storage_class()
