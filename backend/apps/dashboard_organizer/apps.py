from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class DashboardOrganizerConfig(AppConfig):
    name = "apps.dashboard_organizer"
    verbose_name = _("Dashboard")

    def ready(self):
        try:
            import apps.dashboard_organizer.signals  # noqa

        except ImportError as e:
            print("error,", e, "\n")
            pass
