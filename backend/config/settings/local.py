import socket

from .base import *  # noqa
from .base import env

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True
# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    default="fngHa1p2szFdIbvzxp3zjlBEt9Gup7OIAtjjHsOglxqLZlGEvmUa5DGWS02PutFw",
)
# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ["*"]

# CACHES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#caches
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "",
    }
}

# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = env(
    "DJANGO_EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend"
)
DEFAULT_FROM_EMAIL = env(
    "DJANGO_DEFAULT_FROM_EMAIL",
    default="SocialPass <noreply@socialpass.io>",
)
# https://docs.djangoproject.com/en/dev/ref/settings/#server-email
# SERVER_EMAIL = env("DJANGO_SERVER_EMAIL", default=DEFAULT_FROM_EMAIL)
# https://docs.djangoproject.com/en/dev/ref/settings/#email-subject-prefix
EMAIL_SUBJECT_PREFIX = env(
    "DJANGO_EMAIL_SUBJECT_PREFIX",
    default="[SocialPass]",
)

# WhiteNoise
# ------------------------------------------------------------------------------
# http://whitenoise.evans.io/en/latest/django.html#using-whitenoise-in-development
INSTALLED_APPS = ["whitenoise.runserver_nostatic"] + INSTALLED_APPS  # noqa F405

# django-debug-toolbar
# ------------------------------------------------------------------------------
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#prerequisites
INSTALLED_APPS += ["debug_toolbar", "django_extensions"]  # noqa F405
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#middleware
MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]  # noqa F405
# https://django-debug-toolbar.readthedocs.io/en/latest/configuration.html#debug-toolbar-config
DEBUG_TOOLBAR_CONFIG = {
    "DISABLE_PANELS": ["debug_toolbar.panels.redirects.RedirectsPanel"],
    "SHOW_TEMPLATE_CONTEXT": True,
}
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#internal-ips
INTERNAL_IPS = ["127.0.0.1", "10.0.2.2", "0.0.0.0", "localhost"]

#hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
#INTERNAL_IPS += [".".join(ip.split(".")[:-1] + ["1"]) for ip in ips]

# Celery
# ------------------------------------------------------------------------------
# NOTE:
# CELERY_LOCAL_DEVELOPMENT defaults to false, to avoid requiring celery without docker
# With Docker, this .env is set to True
CELERY_LOCAL_DEVELOPMENT = env("CELERY_LOCAL_DEVELOPMENT", default=False)
if CELERY_LOCAL_DEVELOPMENT:
    # https://docs.celeryq.dev/en/stable/userguide/configuration.html#task-always-eager
    CELERY_TASK_ALWAYS_EAGER = False
    # https://docs.celeryq.dev/en/stable/userguide/configuration.html#task-eager-propagates
    CELERY_TASK_EAGER_PROPAGATES = False
else:
    # https://docs.celeryq.dev/en/stable/userguide/configuration.html#task-always-eager
    CELERY_TASK_ALWAYS_EAGER = True
    # https://docs.celeryq.dev/en/stable/userguide/configuration.html#task-eager-propagates
    CELERY_TASK_EAGER_PROPAGATES = True

# Media
# ------------------------------------------------------------------------------
# NOTE: This is only for local or development testing.
BASE_URL = env("BASE_URL")
MEDIA_URL = BASE_URL + "/media/"


# Your stuff...
# ------------------------------------------------------------------------------
SHELL_PLUS_PRINT_SQL = True
INSTALLED_APPS += ["drf_yasg"]
