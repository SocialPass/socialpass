import os

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps import views as sitemap_views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path
from django.views.generic import TemplateView

from apps.marketing.sitemaps import MarketingSiteMap

# Django Template URLs
urlpatterns = [
    # Landing Pages / Marketing
    path("", include("apps.marketing.urls")),
    # Event Checkout
    path("", include("apps.checkout.urls")),
    # User Auth
    path("accounts/", include("allauth.urls")),
    path("accounts/", include("allauth.socialaccount.urls")),
    # Organizer Dashboard
    path("dashboard/", include("apps.dashboard_organizer.urls")),
    # Staff Dashboard
    path(settings.STAFF_URL, include("apps.dashboard_staff.urls")),
]

# Django settings URLs (admin and media)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  # type: ignore
urlpatterns += [path(settings.ADMIN_URL, admin.site.urls)]


# SITEMAPS URLs
sitemaps = {
    "marketing": MarketingSiteMap,
    # "events-discovery": EventDetailSiteMap
}
urlpatterns += [
    path(
        "sitemap.xml",
        sitemap_views.index,
        {"sitemaps": sitemaps},
        name="django.contrib.sitemaps.views.sitemap",
    ),  # type: ignore
    path(
        "sitemap-<section>.xml",
        sitemap_views.sitemap,
        {"sitemaps": sitemaps},
        name="django.contrib.sitemaps.views.sitemap",
    ),  # type: ignore
    path(
        "robots.txt",
        TemplateView.as_view(template_name="robots.txt", content_type="text/plain"),
    ),  # type: ignore
]

# Local URLs
is_local = (
    settings.DEBUG and os.environ["DJANGO_SETTINGS_MODULE"] == "config.settings.local"
)
if is_local:
    # Static files
    urlpatterns += staticfiles_urlpatterns()  # type: ignore

    # Django Debug Toolbar
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
