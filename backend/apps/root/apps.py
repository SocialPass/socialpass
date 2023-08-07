from django.apps import AppConfig


class RootConfig(AppConfig):
    name = "apps.root"
    verbose_name = "Root"

    def ready(self):
        try:
            import apps.root.signals  # noqa

        except ImportError as e:
            print("error,", e, "\n")
            pass