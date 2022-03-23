from django.urls import path

from . import views

app_name = "root"
urlpatterns = [
    # hosted page
    path('hostedpage/<str:subdomain>/', views.HostedPageRetrieve.as_view()),
    # ticketing
    path(
        "ticketgates/retrieve/<str:public_id>/",
        views.TicketGateRetrieve.as_view(),
        name="ticketgate-retrieve",
    ),
    path(
        "ticketgates/access/",
        views.TicketGateAccess.as_view(),
        name="ticketgate-access",
    ),
]
