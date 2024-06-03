"""
Base settings to build other settings files upon.
"""

import sys
from pathlib import Path

import environ

from . import integrations

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent.parent
APPS_DIR = ROOT_DIR / "apps"
env = environ.Env()

READ_DOT_ENV_FILE = env.bool("DJANGO_READ_DOT_ENV_FILE", default=True)
# Note: OS environment variables take precedence over variables from .env
if READ_DOT_ENV_FILE:
    # Local env vars
    if env("DJANGO_SETTINGS_MODULE") == "config.settings.local":
        env.read_env(str(ROOT_DIR / ".envs" / ".donotpush"))
        env.read_env(str(ROOT_DIR / ".envs" / ".env.local"))
    # Testing env vars
    if env("DJANGO_SETTINGS_MODULE") == "config.settings.test":
        env.read_env(str(ROOT_DIR / ".envs" / ".donotpush"))
        env.read_env(str(ROOT_DIR / ".envs" / ".env.test"))
    # Production env vars (kamal)
    if env("DJANGO_SETTINGS_MODULE") == "config.settings.production":
        env.read_env(str(ROOT_DIR / ".env"))

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = env.bool("DJANGO_DEBUG", False)

# Local time zone. Choices are
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# though not all of them may be available with every OS.
# In Windows, this must be set to your system time zone.
TIME_ZONE = "UTC"
# https://docs.djangoproject.com/en/dev/ref/settings/#language-code
LANGUAGE_CODE = "en-us"
# https://docs.djangoproject.com/en/dev/ref/settings/#site-id
SITE_ID = 1
# https://docs.djangoproject.com/en/dev/ref/settings/#use-i18n
USE_I18N = True
# https://docs.djangoproject.com/en/dev/ref/settings/#use-tz
USE_TZ = True
# https://docs.djangoproject.com/en/dev/ref/settings/#locale-paths
LOCALE_PATHS = [str(ROOT_DIR / "locale")]

# DATABASES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#databases

# Restricts DB against collectstatic command
if len(sys.argv) > 0 and sys.argv[1] != "collectstatic":
    DATABASES = {
        "default": env.db(
            "DJANGO_DATABASE_URL", default="postgres:///local_socialpass_db"
        ),
    }
    DATABASES["default"]["CONN_MAX_AGE"] = env.int("CONN_MAX_AGE", default=60)  # noqa F405
    DATABASES["default"]["ATOMIC_REQUESTS"] = True

# https://docs.djangoproject.com/en/stable/ref/settings/#std:setting-DEFAULT_AUTO_FIELD
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# URLS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#root-urlconf
ROOT_URLCONF = "apps.router"
# https://docs.djangoproject.com/en/dev/ref/settings/#wsgi-application
WSGI_APPLICATION = "config.wsgi.application"

# APPS
# ------------------------------------------------------------------------------
DJANGO_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.sites",
    "django.contrib.sitemaps",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",
    "django.contrib.admin",
    "django.forms",
]
THIRD_PARTY_APPS = [
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "crispy_forms",
    "crispy_bootstrap5",
    "procrastinate.contrib.django",
    "django_quill",
    "storages",
]

LOCAL_APPS = [
    "apps.root.apps.RootConfig",
    "templatetags",
]
# https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# MIGRATIONS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#migration-modules
MIGRATION_MODULES = {"sites": "config.contrib.sites.migrations"}

# AUTHENTICATION
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#authentication-backends
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]
# https://docs.djangoproject.com/en/dev/ref/settings/#auth-user-model
AUTH_USER_MODEL = "root.User"
# https://docs.djangoproject.com/en/dev/ref/settings/#login-redirect-url
LOGIN_REDIRECT_URL = "dashboard_organizer:dashboard_redirect"
# https://docs.djangoproject.com/en/dev/ref/settings/#login-url
LOGIN_URL = "account_login"
# https://docs.allauth.org/en/latest/socialaccount/index.html
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": env("GOOGLE_OAUTH_CLIENT_ID", default=""),
            "secret": env("GOOGLE_OAUTH_CLIENT_SECRET", default=""),
            "key": "",
        },
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
    }
}

# PASSWORDS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#password-hashers
PASSWORD_HASHERS = [
    # https://docs.djangoproject.com/en/dev/topics/auth/passwords/#using-argon2-with-django
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]
# https://docs.djangoproject.com/en/dev/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# MIDDLEWARE
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#middleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "config.settings.middleware.LicenseMiddleware"
]

# TEMPLATES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#templates
TEMPLATES = [
    {
        # https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-TEMPLATES-BACKEND
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # https://docs.djangoproject.com/en/dev/ref/settings/#app-dirs
        "DIRS": [
            # Dashboard
            str(ROOT_DIR / "templates"),
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            # https://docs.djangoproject.com/en/dev/ref/settings/#template-context-processors
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.template.context_processors.i18n",
                "django.template.context_processors.media",
                "django.template.context_processors.static",
                "django.template.context_processors.tz",
                "django.contrib.messages.context_processors.messages",
                "apps.root.context_processors.export_vars",
            ],
        },
    }
]

# https://docs.djangoproject.com/en/dev/ref/settings/#form-renderer
FORM_RENDERER = "django.forms.renderers.TemplatesSetting"

# http://django-crispy-forms.readthedocs.io/en/latest/install.html#template-packs
CRISPY_TEMPLATE_PACK = "bootstrap5"
CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap5"

# STATIC
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#static-root
STATIC_ROOT = str(ROOT_DIR / "staticfiles")
# https://docs.djangoproject.com/en/dev/ref/settings/#static-url
STATIC_URL = "/static/"
# https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#std:setting-STATICFILES_DIRS
STATICFILES_DIRS = [str(ROOT_DIR / "static")]
# https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#staticfiles-finders
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]


# MEDIA
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#media-root
MEDIA_ROOT = str(ROOT_DIR / "media")
# https://docs.djangoproject.com/en/dev/ref/settings/#media-url
DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"
PRIVATE_TICKET_STORAGE = "django.core.files.storage.FileSystemStorage"

# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = env(
    "DJANGO_EMAIL_BACKEND",
    default="django.core.mail.backends.smtp.EmailBackend",
)
# https://docs.djangoproject.com/en/dev/ref/settings/#email-timeout
EMAIL_TIMEOUT = 5
# https://docs.djangoproject.com/en/dev/ref/settings/#default-from-email
DEFAULT_FROM_EMAIL = env(
    "DJANGO_DEFAULT_FROM_EMAIL",
    default="SocialPass <noreply@socialpass.io>",
)
# https://docs.djangoproject.com/en/dev/ref/settings/#server-email
SERVER_EMAIL = env("DJANGO_SERVER_EMAIL", default=DEFAULT_FROM_EMAIL)
# https://docs.djangoproject.com/en/dev/ref/settings/#email-subject-prefix
EMAIL_SUBJECT_PREFIX = env(
    "DJANGO_EMAIL_SUBJECT_PREFIX",
    default="[SocialPass]",
)


# ADMIN
# ------------------------------------------------------------------------------
# Django Admin URL regex.
ADMIN_URL = env("DJANGO_ADMIN_URL", default="")

# LOGGING
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#logging
# See https://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s "
            "%(process)d %(thread)d %(message)s"
        }
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        }
    },
    "root": {"level": "INFO", "handlers": ["console"]},
}


# django-allauth
# ------------------------------------------------------------------------------
# https://django-allauth.readthedocs.io/en/latest/configuration.html
ACCOUNT_EMAIL_VERIFICATION = "mandatory"

# https://django-allauth.readthedocs.io/en/latest/views.html#logout-account-logout
ACCOUNT_LOGOUT_ON_GET = True

# https://django-allauth.readthedocs.io/en/latest/configuration.html?highlight=ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION#configuration
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True

# https://django-allauth.readthedocs.io/en/latest/account/advanced.html
# Note: Allows for email-only auth
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "email"

# https://docs.allauth.org/en/latest/socialaccount/configuration.html
SOCIALACCOUNT_LOGIN_ON_GET = True

# Your stuff...
# INTERNAL
# ------------------------------------------------------------------------------
STAFF_URL = env("STAFF_URL", default="")

# MORALIS
# ------------------------------------------------------------------------------
MORALIS_API_KEY = env("MORALIS_API_KEY", default="")

# GMAPS
# ------------------------------------------------------------------------------
GOOGLE_MAPS_API_KEY = env("GOOGLE_MAPS_API_KEY", default="")

# GWALLET
# ------------------------------------------------------------------------------
GOOGLE_WALLET_PRIVATE_KEY_ID = env("GOOGLE_WALLET_PRIVATE_KEY_ID", default="")
GOOGLE_WALLET_PRIVATE_KEY = env("GOOGLE_WALLET_PRIVATE_KEY", default="")
GOOGLE_WALLET_CLIENT_ID = env("GOOGLE_WALLET_CLIENT_ID", default="")
GOOGLE_WALLET_ISSUER_ID = env("GOOGLE_WALLET_ISSUER_ID", default="")
GOOGLE_WALLET_PROJECT_ID = env("GOOGLE_WALLET_PROJECT_ID", default="")
GOOGLE_WALLET_CLIENT_EMAIL = env("GOOGLE_WALLET_CLIENT_EMAIL", default="")
GOOGLE_WALLET_CLIENT_CERT_URL = env("GOOGLE_WALLET_CLIENT_CERT_URL", default="")

# APPLE WALLET
# ------------------------------------------------------------------------------
APPLE_WALLET_CERTIFICATE = env("APPLE_WALLET_CERTIFICATE", default="")
APPLE_WALLET_KEY = env("APPLE_WALLET_KEY", default="")
APPLE_WALLET_WWDR_CERTIFICATE = env("APPLE_WALLET_WWDR_CERTIFICATE", default="")
APPLE_WALLET_PASSWORD = env("APPLE_WALLET_PASSWORD", default="")
APPLE_WALLET_PASS_TYPE_ID = env("APPLE_WALLET_PASS_TYPE_ID", default="")
APPLE_WALLET_TEAM_ID = env("APPLE_WALLET_TEAM_ID", default="")

# QUILL RICH TEXT EDITOR
# ------------------------------------------------------------------------------
QUILL_CONFIGS = {
    "default": {
        "theme": "snow",
        "modules": {
            "syntax": True,
            "toolbar": [
                [
                    {"align": []},
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                ],
                ["link"],
            ],
        },
    }
}

# STRIPE
# ------------------------------------------------------------------------------
STRIPE_API_KEY = env("STRIPE_API_KEY", default="")


# PROCRASTINATE
# ------------------------------------------------------------------------------
# https://procrastinate.readthedocs.io/en/stable/reference.html#procrastinate.App.run_worker_async

# 3RD PARTY INTEGRATIONS
# ------------------------------------------------------------------------------
SOCIALPASS_INTEGRATIONS = integrations.SOCIALPASS_INTEGRATIONS
