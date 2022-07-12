import factory
import factory.django
from django.contrib.auth import get_user_model

from apps.dashboard.models import Membership, Team
from apps.root.models import Event

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    username = factory.Faker("name")
    email = factory.Faker("email")
    password = factory.Faker("password")

    class Meta:
        model = User


class TeamFactory(factory.django.DjangoModelFactory):
    name = factory.Faker("name")

    class Meta:
        model = Team


class MembershipFactory(factory.django.DjangoModelFactory):
    user = factory.SubFactory(UserFactory)
    team = factory.SubFactory(TeamFactory)

    class Meta:
        model = Membership


class EventFactory(factory.django.DjangoModelFactory):
    user = factory.SubFactory(UserFactory)
    team = factory.SubFactory(TeamFactory)
    title = factory.Faker("name")
    description = factory.Faker("sentence")
    start_date = factory.Faker("date_time")
    cover_image = factory.django.ImageField(color="blue")
    capacity = 100
    limit_per_person = 1
    requirements = []

    class Meta:
        model = Event


class UserWithTeamFactory(UserFactory):
    membership = factory.RelatedFactory(
        MembershipFactory,
        factory_related_name="user",
    )


class UserWith2TeamsFactory(UserFactory):
    membership1 = factory.RelatedFactory(
        MembershipFactory, factory_related_name="user", team__name="Team 1"
    )
    membership2 = factory.RelatedFactory(
        MembershipFactory, factory_related_name="user", team__name="Team 2"
    )
