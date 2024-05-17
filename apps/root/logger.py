from django.conf import settings

import rollbar


class Logger:
    """
    This is a wrapper class to check the configured logging system, and call
    the appropriate methods. If nothing is configured, then the calls are
    simply ignored.
    """

    @staticmethod
    def report_exc_info():
        if settings.SOCIALPASS_INTEGRATIONS["logging"] == "rollbar":
            rollbar.report_exc_info()

    @staticmethod
    def report_message(message):
        if settings.SOCIALPASS_INTEGRATIONS["logging"] == "rollbar":
            rollbar.report_message(message)
