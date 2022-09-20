from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class RootConfig(AppConfig):
    name = "apps.root"
    verbose_name = _("Root")
