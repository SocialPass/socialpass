from django.apps import AppConfig


class DashboardOrganizerConfig(AppConfig):
    name = "apps.dashboard_organizer"
    verbose_name = "Dashboard"

    def ready(self):
        try:
            import apps.dashboard_organizer.signals  # noqa

        except ImportError as e:
            print("error,", e, "\n")
            pass
