from django.urls import path

from . import views_site


urlpatterns = [
    path("", views_site.index, name="index"),
    path("test-permission/", views_site.test_permission, name="test_permission"),
]
