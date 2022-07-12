import random

import factory
import factory.django
from django.contrib.auth import get_user_model

from apps.dashboard.models import Membership, Team
from apps.root.models import Event

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    """
    Create user
    """

    username = factory.Faker("name")
    email = factory.Faker("email")
    password = factory.Faker("password")

    class Meta:
        model = User


class EventFactory(factory.django.DjangoModelFactory):
    """
    Create event
    """

    title = title = factory.Faker("sentence", nb_words=5, variable_nb_words=True)
    description = factory.Faker("paragraph")
    start_date = factory.Faker("date_time")
    cover_image = factory.django.ImageField(color="blue")
    capacity = factory.LazyAttribute(lambda x: random.randrange(0, 10000))
    limit_per_person = 1
    requirements = []

    class Meta:
        model = Event


class TeamFactory(factory.django.DjangoModelFactory):
    """
    Create team with event
    """

    name = factory.Faker("name")
    event = factory.RelatedFactory(EventFactory, factory_related_name="team")

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


class UserWith2TeamsFactory(UserFactory):
    """
    Create one user with two team memberships
    """

    membership1 = factory.RelatedFactory(
        MembershipFactory, factory_related_name="user", team__name="Team 1"
    )
    membership2 = factory.RelatedFactory(
        MembershipFactory, factory_related_name="user", team__name="Team 2"
    )
