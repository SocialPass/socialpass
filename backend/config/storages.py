from django.conf import settings
from django.core.files.storage import get_storage_class
from storages.backends.s3boto3 import S3Boto3Storage


class StaticRootS3Boto3Storage(S3Boto3Storage):
    location = "public/static"
    default_acl = "public-read"
    custom_domain = False


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


class CachedS3Boto3Storage(S3Boto3Storage):
    """
    S3 storage backend that saves the files locally, too.
    TODO: change compressor storage to brotli
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.local_storage = get_storage_class(
            "compressor.storage.CompressorFileStorage")()

    def save(self, name, content):
        self.local_storage._save(name, content)
        super().save(name, self.local_storage._open(name))
        return name


def get_private_ticket_storage():
    private_storage_class = get_storage_class(settings.PRIVATE_TICKET_STORAGE)
    return private_storage_class()
