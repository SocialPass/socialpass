from django.conf import settings
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path

# Base Django URL's
urlpatterns = [
    # Django Admin, use {% url 'admin:index' %}{% endraw %}
    path(settings.ADMIN_URL, admin.site.urls),
    # User management
    path("accounts/", include("allauth.urls")),
    # Invite management
    path("invitations/", include('invitations.urls', namespace='invitations')),
    # Custom stuff goes here
    path("", include("root.site_urls")),
]

# DRF API URLS
urlpatterns += [
    # API base url
    path("api/", include("root.api_urls")),
]

# Debug URL's
if settings.DEBUG:
    # Static file serving when using Gunicorn + Uvicorn for local web socket development
    urlpatterns += staticfiles_urlpatterns()

    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
