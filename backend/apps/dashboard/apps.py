from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class RootConfig(AppConfig):
    name = "apps.dashboard"
    verbose_name = _("Dashboard")

    def ready(self):
        try:
            import apps.dashboard.signals

        except ImportError as e:
            print("error,", e, "\n")
            pass
