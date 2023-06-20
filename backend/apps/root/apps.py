from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class RootConfig(AppConfig):
    name = "apps.root"
    verbose_name = _("Root")

    def ready(self):
        try:
            import apps.root.signals.new_user_invitation_callback  # noqa

        except ImportError as e:
            print("error,", e, "\n")
            pass

