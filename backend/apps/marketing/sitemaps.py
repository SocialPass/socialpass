# sitemaps.py
from django.contrib import sitemaps
from django.urls import reverse


class MarketingSiteMap(sitemaps.Sitemap):
    """
    class to define static pages on event marketing app
    """
    changefreq = "monthly"
    priority = 1.0

    def items(self):
        return ["marketing:index"]

    def location(self, item):
        return reverse(item)


'''
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
        return reverse("checkout:checkout_one", args=(item["public_id"],))
'''
