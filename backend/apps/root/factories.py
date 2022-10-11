import random

import factory
import factory.django
import factory.fuzzy
from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.root.models import (
    CheckoutItem,
    CheckoutSession,
    Event,
    Membership,
    Team,
    Ticket,
    TicketRedemptionKey,
    TicketTier,
    TxAssetOwnership,
    TxBlockchain,
    TxFiat,
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

    team = factory.SubFactory(TeamFactory)
    title = factory.Faker("sentence", nb_words=5, variable_nb_words=True)
    organizer = factory.Faker("name")
    description = factory.Faker("paragraph")
    start_date = factory.fuzzy.FuzzyDateTime(timezone.now())
    cover_image = factory.django.ImageField(color="blue")
    initial_place = factory.Faker("address")
    lat = 41.40338
    long = 2.17403
    city = factory.Faker("city")

    class Meta:
        model = Event


class TicketRedemptionKeyFactory(factory.django.DjangoModelFactory):
    """
    Create ticket
    """

    name = factory.Faker("name")
    event = factory.SubFactory(EventFactory)

    class Meta:
        model = TicketRedemptionKey


class TicketTierFactory(factory.django.DjangoModelFactory):
    """
    Create ticket_tier
    """

    ticket_type = "test"
    price = 1.00000000
    capacity = factory.LazyAttribute(lambda x: random.randrange(0, 10000))
    quantity_sold = 0
    max_per_person = 1
    event = factory.SubFactory(EventFactory)

    class Meta:
        model = TicketTier


class CheckoutSessionFactory(factory.django.DjangoModelFactory):
    """
    Create checkout session
    """

    expiration = factory.fuzzy.FuzzyDateTime(timezone.now())
    name = factory.Faker("name")
    email = factory.Faker("email")
    cost = 1
    event = factory.SubFactory(EventFactory)

    class Meta:
        model = CheckoutSession


class CheckoutItemFactory(factory.django.DjangoModelFactory):
    """
    Create checkout item with ticket tier and checkout session
    """

    quantity = factory.LazyAttribute(lambda x: random.randrange(0, 100))
    ticket_tier = factory.SubFactory(TicketTierFactory)
    checkout_session = factory.SubFactory(CheckoutSessionFactory)

    class Meta:
        model = CheckoutItem


class TxFiatFactory(factory.django.DjangoModelFactory):
    """
    Create fiat transaction
    """

    checkout_session = factory.SubFactory(CheckoutSessionFactory)

    class Meta:
        model = TxFiat


class TxBlockchainFactory(factory.django.DjangoModelFactory):
    """
    Create blockchain transaction
    """

    checkout_session = factory.SubFactory(CheckoutSessionFactory)

    class Meta:
        model = TxBlockchain


class TxAssetOwnershipFactory(factory.django.DjangoModelFactory):
    """
    Create asset_ownership transaction
    """

    checkout_session = factory.SubFactory(CheckoutSessionFactory)

    class Meta:
        model = TxAssetOwnership


class TicketFactory(factory.django.DjangoModelFactory):
    """
    Create ticket
    """

    event = factory.SubFactory(EventFactory)
    ticket_tier = factory.SubFactory(TicketTierFactory)
    checkout_item = factory.SubFactory(CheckoutItemFactory)
    checkout_session = factory.SubFactory(CheckoutSessionFactory)
    file = factory.django.ImageField(color="red")

    class Meta:
        model = Ticket
