import os

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps import views as sitemap_views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path
from django.views.generic import TemplateView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view

from apps.event_discovery.sitemaps import EventDetailSiteMap, StaticViewEventSitemap

# Django Template URLs
urlpatterns = [
    # Event Discovery
    path("", include("apps.event_discovery.urls")),
    # Organizer Dashboard
    path("dashboard/", include("apps.dashboard_organizer.urls")),
    path("dashboard/accounts/", include("allauth.urls")),
    # Staff Dashboard
    path(settings.STAFF_URL, include("apps.staff_dashboard.urls")),
]

# Django settings URLs (admin and media)
urlpatterns += static(
    settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
)  # type: ignore
urlpatterns += [path(settings.ADMIN_URL, admin.site.urls)]

# DRF API URLs
urlpatterns += [
    path("api/scanner/v1/", include("apps.api_scanner.urls")),
    path("api/checkout/v1/", include("apps.api_checkout.urls")),
]

# SITEMAPS URLs
sitemaps = {"discovery": StaticViewEventSitemap, "events-discovery": EventDetailSiteMap}
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

# Profiling URLs
urlpatterns += [path(settings.SILKY_URL, include("silk.urls", namespace="silk"))]

# Local URLs
is_local = (
    settings.DEBUG and os.environ["DJANGO_SETTINGS_MODULE"] == "config.settings.local"
)
if is_local:
    # Static files
    urlpatterns += staticfiles_urlpatterns()  # type: ignore

    # OpenAPI Schema
    schema_view = get_schema_view(
        openapi.Info(
            title="SocialPass API",
            default_version="v1",
            description="Test description",
            terms_of_service="https://www.google.com/policies/terms/",
            contact=openapi.Contact(email="contact@snippets.local"),
            license=openapi.License(name="BSD License"),
        ),
        public=True,
    )

    # SwaggerUI
    urlpatterns += [
        path(
            "swagger/",
            schema_view.with_ui("swagger", cache_timeout=0),
            name="schema-swagger-ui",
        ),
        path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    ]

    # Django Debug Toolbar
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
