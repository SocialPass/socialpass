from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class RootConfig(AppConfig):
    name = "backend.root"
    verbose_name = _("Root")

    def ready(self):
        try:
            import backend.root.signals  # noqa F401
        except ImportError:
            pass
