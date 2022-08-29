import random
from typing import Any

import factory
import factory.django
import factory.fuzzy
from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.root.models import (
    Attendee,
    Event,
    Membership,
    Team,
    Ticket,
    TicketRedemptionKey,
)

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    """
    Create user
    """

    username = factory.Faker("name")
    email = factory.Faker("email")
    password = factory.PostGenerationMethodCall("set_password", "password")

    class Meta:
        model = User


class TeamFactory(factory.django.DjangoModelFactory):
    """
    Create team with event
    """

    name = factory.Faker("name")

    class Meta:
        model = Team


class MembershipFactory(factory.django.DjangoModelFactory):
    """
    Create membership to team
    """

    user = factory.SubFactory(UserFactory)
    team = factory.SubFactory(TeamFactory)

    class Meta:
        model = Membership


class UserWithTeamFactory(UserFactory):
    """
    Create user with team membership
    """

    membership = factory.RelatedFactory(
        MembershipFactory,
        factory_related_name="user",
    )


class EventFactory(factory.django.DjangoModelFactory):
    """
    Create event
    """

    title = factory.Faker("sentence", nb_words=5, variable_nb_words=True)
    organizer = factory.Faker("name")
    description = factory.Faker("paragraph")
    start_date = factory.fuzzy.FuzzyDateTime(timezone.now())
    cover_image = factory.django.ImageField(color="blue")
    capacity = factory.LazyAttribute(lambda x: random.randrange(0, 10000))
    limit_per_person = 1
    requirements: Any = []
    initial_place = factory.Faker("address")
    lat = 41.40338
    long = 2.17403

    class Meta:
        model = Event


class AttendeeFactory(factory.django.DjangoModelFactory):
    """
    Create blockchain ownership
    """

    event = factory.SubFactory(EventFactory)

    class Meta:
        model = Attendee


class TicketFactory(factory.django.DjangoModelFactory):
    """
    Create ticket
    """

    event = factory.SubFactory(EventFactory)
    file = factory.django.ImageField(color="red")

    class Meta:
        model = Ticket


class TicketRedemptionKeyFactory(factory.django.DjangoModelFactory):
    """
    Create ticket
    """

    name = factory.Faker("name")
    event = factory.SubFactory(EventFactory)

    class Meta:
        model = TicketRedemptionKey
