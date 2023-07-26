from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class DashboardOrganizerConfig(AppConfig):
    name = "apps.dashboard_organizer"
    verbose_name = _("Dashboard")