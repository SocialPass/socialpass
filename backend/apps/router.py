from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path

urlpatterns = [
    path("", include("apps.dashboard.urls")),
    # Django Admin, use {% url 'admin:index' %}{% endraw %}
    path(settings.ADMIN_URL, admin.site.urls),
    # Customer account management
    path("accounts/", include("allauth.urls")),
    # Customer Invitations
    path("invitations/", include("invitations.urls", namespace="invitations")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# DRF API URLS
urlpatterns += [
    # API - Event Portal
    path("api/event-portal/", include("apps.api_eventportal.urls")),
    path("api/scanner/", include("apps.api_scanner.urls")),
]

# Debug URL's
if settings.DEBUG:
    # Static file serving when using Gunicorn + Uvicorn for local web socket development
    urlpatterns += staticfiles_urlpatterns()

    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
