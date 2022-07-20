import os

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path

urlpatterns = [
    path("", include("apps.event_discovery.urls")),
    path("dashboard/", include("apps.dashboard.urls")),
    # Django Admin, use {% url 'admin:index' %}{% endraw %}
    path(settings.ADMIN_URL, admin.site.urls),
] + static(
    settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
)  # type: ignore

# DRF API URLS
urlpatterns += [
    path("api/checkout-portal/v1/", include("apps.api_checkoutportal.urls")),
    path("api/scanner/v1/", include("apps.api_scanner.urls")),
]

# Debug URL's (only for local)
is_local = (
    settings.DEBUG and os.environ["DJANGO_SETTINGS_MODULE"] == "config.settings.local"
)
if is_local:
    urlpatterns += staticfiles_urlpatterns()  # type: ignore

    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
