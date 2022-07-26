import os

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps import views as sitemap_views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path

from apps.event_discovery.sitemaps import EventDetailSiteMap, StaticViewEventSitemap

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

# SITEMAPS URLS
sitemaps = {
    "discovery": StaticViewEventSitemap,
    "discovery-events": EventDetailSiteMap
}
urlpatterns += [
    path(
        'sitemap.xml',
        sitemap_views.index,
        {'sitemaps': sitemaps},
        name='django.contrib.sitemaps.views.sitemap'
    ),  # type: ignore
    path(
        'sitemap-<section>.xml',
        sitemap_views.sitemap,
        {'sitemaps': sitemaps},
        name='django.contrib.sitemaps.views.sitemap'
    ),  # type: ignore
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
