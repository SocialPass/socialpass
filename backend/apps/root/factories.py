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
    TierAssetOwnership,
    TierBlockchain,
    TierFiat,
    TxAssetOwnership,
    TxBlockchain,
    TxFiat,
)

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    """
    Create user
    """

    class Meta:
        model = User

    username = factory.Faker("name")
    email = factory.Faker("email")
    password = factory.PostGenerationMethodCall("set_password", "password")


class TeamFactory(factory.django.DjangoModelFactory):
    """
    Create team with event
    """

    class Meta:
        model = Team

    name = factory.Faker("color_name")


class MembershipFactory(factory.django.DjangoModelFactory):
    """
    Create membership to team
    """

    class Meta:
        model = Membership

    user = factory.SubFactory(UserFactory)
    team = factory.SubFactory(TeamFactory)


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

    class Meta:
        model = Event

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


class TicketRedemptionKeyFactory(factory.django.DjangoModelFactory):
    """
    Create ticket
    """

    class Meta:
        model = TicketRedemptionKey

    name = factory.Faker("name")
    event = factory.SubFactory(EventFactory)


class TierFiatFactory(factory.django.DjangoModelFactory):
    """
    Create fiat tier
    """

    class Meta:
        model = TierFiat


class TierBlockchainFactory(factory.django.DjangoModelFactory):
    """
    Create blockchain tier
    """

    class Meta:
        model = TierBlockchain


class TierAssetOwnershipFactory(factory.django.DjangoModelFactory):
    """
    Create asset_ownership tier
    """

    class Meta:
        model = TierAssetOwnership


class TicketTierFactory(factory.django.DjangoModelFactory):
    """
    Create ticket_tier
    """

    class Meta:
        model = TicketTier

    ticket_type = "test"
    capacity = factory.LazyAttribute(lambda x: random.randrange(0, 10000))
    quantity_sold = 0
    max_per_person = 1
    event = factory.SubFactory(EventFactory)
    tier_fiat = factory.SubFactory(TierFiatFactory)
    tier_blockchain = factory.SubFactory(TierBlockchainFactory)
    tier_asset_ownership = factory.SubFactory(TierAssetOwnershipFactory)


class CheckoutSessionFactory(factory.django.DjangoModelFactory):
    """
    Create checkout session
    """

    class Meta:
        model = CheckoutSession

    expiration = factory.fuzzy.FuzzyDateTime(timezone.now())
    name = factory.Faker("name")
    email = factory.Faker("email")
    cost = 1
    event = factory.SubFactory(EventFactory)


class CheckoutItemFactory(factory.django.DjangoModelFactory):
    """
    Create checkout item with ticket tier and checkout session
    """

    class Meta:
        model = CheckoutItem

    quantity = factory.LazyAttribute(lambda x: random.randrange(0, 100))
    ticket_tier = factory.SubFactory(TicketTierFactory)
    checkout_session = factory.SubFactory(CheckoutSessionFactory)


class TxFiatFactory(factory.django.DjangoModelFactory):
    """
    Create fiat transaction
    """

    class Meta:
        model = TxFiat

    checkout_session = factory.SubFactory(CheckoutSessionFactory)


class TxBlockchainFactory(factory.django.DjangoModelFactory):
    """
    Create blockchain transaction
    """

    class Meta:
        model = TxBlockchain

    checkout_session = factory.SubFactory(CheckoutSessionFactory)


class TxAssetOwnershipFactory(factory.django.DjangoModelFactory):
    """
    Create asset_ownership transaction
    """

    class Meta:
        model = TxAssetOwnership

    checkout_session = factory.SubFactory(CheckoutSessionFactory)


class TicketFactory(factory.django.DjangoModelFactory):
    """
    Create ticket
    """

    class Meta:
        model = Ticket

    event = factory.SubFactory(EventFactory)
    ticket_tier = factory.SubFactory(TicketTierFactory)
    checkout_item = factory.SubFactory(CheckoutItemFactory)
    checkout_session = factory.SubFactory(CheckoutSessionFactory)
