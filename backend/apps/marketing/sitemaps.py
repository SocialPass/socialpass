# sitemaps.py
from django.contrib import sitemaps
from django.urls import reverse

from apps.root.models import Event


class StaticViewEventSitemap(sitemaps.Sitemap):
    """
    class to define static pages on event marketing app
    """

    def items(self):
        return ["marketing:index", "marketing:browse"]

    def location(self, item):
        return reverse(item)


class EventDetailSiteMap(sitemaps.Sitemap):
    """
    class to define events urls on event marketing app.
    By limitation, the sitemaps protocol only fetch 50000 items
    """

    changefreq = "daily"
    limit = 50000  # default limit

    def items(self):
        queryset = (
            Event.objects.filter_active()
            .order_by("-created")
            .values("public_id")[: self.limit]
        )  # noqa: E203
        return queryset

    def location(self, item):
        return reverse("marketing:details", args=(item["public_id"],))
