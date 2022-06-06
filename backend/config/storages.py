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
