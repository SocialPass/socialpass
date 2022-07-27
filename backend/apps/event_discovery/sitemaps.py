# sitemaps.py
from django.contrib import sitemaps
from django.urls import reverse

from apps.root.models import Event


class StaticViewEventSitemap(sitemaps.Sitemap):
    """
    class to define static pages on event discovery app
    """
    def items(self):
        return ["discovery:browse", "discovery:index"]

    def location(self, item):
        return reverse(item)


class EventDetailSiteMap(sitemaps.Sitemap):
    """
    class to define events urls on event discovery app.
    By limitation, the sitemaps protocol only fetch 50000 items
    """
    changefreq = "daily"
    limit = 50000  # default limit

    def items(self):
        queryset = Event.objects.filter_featured().values("public_id")[:self.limit]  # noqa: E203
        return queryset

    def location(self, item):
        return reverse("discovery:details", args=(item.public_id,))
