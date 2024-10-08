import requests
from datetime import datetime, timedelta
from django.conf import settings
from django.utils.timezone import now
from apps.root.logger import Logger


class LicenseMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.last_license_check = None

    def __call__(self, request):
        # Check time of last_license_check
        current_time = now()
        if self.last_license_check:
            last_run_time = datetime.fromisoformat(self.last_license_check)
        else:
            last_run_time = current_time - timedelta(days=1)

        # Check if ping should be called, based on last_license_check time vs current time
        if current_time - last_run_time >= timedelta(days=1):
            self.ping(request)
            self.last_license_check = current_time.isoformat()

        return self.get_response(request)

    def ping(self, request):
        if not settings.DEBUG:
            try:
                requests.post(
                    "https://registry.socialpass.io",
                    data={
                        "domain": request.get_host(),
                        "license_key": settings.LICENSE_KEY,
                    },
                )
            except Exception:
                Logger.report_exc_info()
