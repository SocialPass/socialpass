import json
import uuid

import jwt
import rollbar
import stripe
from autoslug import AutoSlugField
from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.contrib.sites.models import Site
from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.mail import send_mail
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils import timezone
from django.utils.functional import cached_property
from django.utils.translation import gettext as _
from eth_account import Account
from eth_account.messages import encode_defunct
from model_utils.models import TimeStampedModel
from moralis import evm_api

from apps.root.exceptions import (
    AlreadyRedeemedError,
    ForbiddenRedemptionError,
    AssetOwnershipCheckoutError,
    FreeCheckoutError,
)
from apps.root.ticketing import AppleTicket, GoogleTicket
from apps.root.utils import get_random_passcode

stripe.api_key = settings.STRIPE_API_KEY


class DBModel(TimeStampedModel):
    """
    Abstract base model that provides useful fields such as timestamps, UUID's, and more.
    This field is inherited by every model
    """

    public_id = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False, db_index=True
    )

    class Meta:
        abstract = True


class User(AbstractUser):
    """
    Django User model inherited from AbstractUser
    Currently blank but allows for easier migration in the future
    """

    def __str__(self):
        return f"User: {self.email}"


class WhiteLabel(DBModel):
    """
    A model used to store all of the information required for white-labeling a
    team.
    """

    brand_name = models.CharField(max_length=255, blank=True)
    logo = models.ImageField(
        blank=True,
        null=True,
        upload_to="whitelabel__logo",
    )
    ticket_logo = models.FileField(  # FileField to support SVGs
        blank=True,
        null=True,
        upload_to="whitelabel__logo",
    )
    ticket_logo_google = models.URLField(max_length=255, blank=True)
    ticket_logo_apple = models.ImageField(
        blank=True,
        null=True,
        upload_to="whitelabel__logo",
    )
    favicon = models.ImageField(
        blank=True,
        null=True,
        upload_to="whitelabel__favicon",
    )
    css = models.TextField(blank=True)
    font_regular = models.FileField(
        blank=True,
        null=True,
        upload_to="whitelabel__font",
    )
    font_bold = models.FileField(
        blank=True,
        null=True,
        upload_to="whitelabel__font",
    )
    ticket_bg_color = models.CharField(max_length=255, blank=True)
    ticket_text_color = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"WhiteLabel: {self.brand_name}"


class Team(DBModel):
    """
    Represents the 'umbrella' model for event organization
    Each user belongs to one or more teams, and each event belongs to a single team.
    """

    # keys
    members = models.ManyToManyField(to="root.User", through="root.Membership")

    # basic info
    name = models.CharField(max_length=255, unique=True)
    slug = AutoSlugField(populate_from="name", null=True, unique=True)
    image = models.ImageField(
        help_text=_(
            "A brand image for your team. Please make sure the image is "
            "square, non-transparent, and ideally in the PNG format."
        ),
        blank=True,
        null=True,
        height_field=None,
        width_field=None,
        upload_to="team__image",
    )
    description = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    whitelabel = models.OneToOneField(
        WhiteLabel,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    allow_rsvp = models.BooleanField(default=False)
    allow_messaging = models.BooleanField(default=False)

    # stripe
    tmp_stripe_account_id = models.CharField(
        max_length=255,
        blank=True,
        help_text=_("Temporary Stripe account ID used to create account links."),
    )
    stripe_account_id = models.CharField(
        max_length=255,
        blank=True,
        help_text=_("Connected Stripe account ID."),
    )
    stripe_account_country = models.CharField(
        max_length=10,
        blank=True,
        help_text=_("Connected Stripe account country."),
    )

    def __str__(self):
        return f"Team: {self.name}"

    @cached_property
    def stripe_account_payouts_enabled(self):
        """
        Use the Stripe API to determine if the team is ready to accept payouts 
        or not. If not, then we block the creation of paid ticket tiers.
        """
        status = {
            "details_submitted": False,
            "payouts_enabled": False,
        }

        # Query Stripe API to get updated status
        if self.stripe_account_id:
            try:
                stripe_account = stripe.Account.retrieve(self.stripe_account_id)
                status["details_submitted"] = stripe_account["details_submitted"]
                status["payouts_enabled"] = stripe_account["payouts_enabled"]
            except Exception as e:
                rollbar.report_message("STRIPE ERROR: " + str(e))

        # OK
        # Return status
        return status

    @cached_property
    def stripe_refresh_link(self):
        """
        Get link to refresh Stripe session.
        """
        domain = Site.objects.all().first().domain
        domain = f"http://{domain}"  # http works in local, converted to https on prod
        url = reverse(
            "dashboard_organizer:stripe_refresh",
            args=[
                self.slug,
            ],
        )
        return domain + url

    @cached_property
    def stripe_return_link(self):
        """
        Link to return to from Stripe session.
        """
        domain = Site.objects.all().first().domain
        domain = f"http://{domain}"  # http works in local, converted to https on prod
        url = reverse(
            "dashboard_organizer:stripe_return",
            args=[
                self.slug,
            ],
        )
        return domain + url

    @cached_property
    def stripe_express_dashboard_link(self):
        """
        Link to Stripe Connect dashboard.
        """
        if self.stripe_account_id:
            login_link = stripe.Account.create_login_link(
                self.stripe_account_id,
            )
            return login_link.url


class Membership(DBModel):
    """
    Represents the relationship between a `Team` and a `User`.
    This model also allows a `User` having multiple `Team`
    """

    class Meta:
        unique_together = ("team", "user")

    # keys
    team = models.ForeignKey("Team", on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey("root.User", on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"Membership: {self.user.email}<>{self.team.name}"


class Invitation(DBModel):
    """
    Represents an invitation to join a respective team.
    """

    # Keys
    inviter = models.ForeignKey("User", on_delete=models.CASCADE)
    team = models.ForeignKey("Team", on_delete=models.CASCADE)
    membership = models.ForeignKey(
        "Membership", on_delete=models.CASCADE, blank=True, null=True
    )

    # Basic info
    accepted = models.BooleanField(default=False)
    email = models.EmailField(max_length=255)

    def __str__(self):
        return f"Invitation: {self.email}<>{self.team.name}"

    @cached_property
    def is_expired(self):
        if timezone.now() > (self.created + timezone.timedelta(days=30)):
            return True
        else:
            return False

    def send_invitation(self, request, **kwargs):
        """
        Send invitation (link to accept and join team) via email.
        """
        invitation_url = reverse(
            "dashboard_organizer:invitation_detail", args=[self.public_id]
        )
        invitation_url = request.build_absolute_uri(invitation_url)
        ctx = kwargs
        ctx.update(
            {
                "team": self.team,
                "invitation_url": invitation_url,
            },
        )
        email_template = "invitations/email/email_invite"
        DefaultAccountAdapter().send_mail(email_template, self.email, ctx)


class Event(DBModel):
    """
    Represents an event on SocialPass
    This event supports multiple states as well as multiple ticker tiers.
    """

    # Keys
    user = models.ForeignKey("User", on_delete=models.SET_NULL, blank=True, null=True)
    team = models.ForeignKey("Team", on_delete=models.CASCADE)
    google_class_id = models.CharField(max_length=255, blank=True)

    # Basic Info
    title = models.CharField(
        max_length=255,
        help_text=_("Brief name for your event. Must be unique!"),
    )
    description = models.TextField(
        help_text=_("A short description of your event."),
    )
    cover_image = models.ImageField(
        help_text=_(
            "A banner image for your event. Please make sure the image "
            "is a high quality landscape image, ideally 960 x 720 pixels (4:3)."
        ),
        blank=True,
        null=True,
        upload_to="event__cover_image",
    )
    timezone = models.CharField(
        verbose_name="time zone",
        max_length=30,
        blank=True,
    )
    start_date = models.DateTimeField(
        help_text=_("When your event will start."),
        blank=True,
        null=True,
    )
    end_date = models.DateTimeField(
        help_text=_("When your event will end (optional)."),
        blank=True,
        null=True,
    )
    fiat_currency = models.CharField(
        max_length=3,
        help_text=_("The fiat currency to use for all tickets of this event."),
        default="USD",
    )
    total_capacity = models.IntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(1)],
        help_text=_("Denotes the total capacity for the venue, across all ticket tiers."),
    )
    waitlist_enabled = models.BooleanField(default=False)

    # Location Info (v1)
    class GeographyType(models.TextChoices):
        GOOGLE = "GOOGLE", "Google"
        MANUAL = "MANUAL", "Manual"

    geo_type = models.CharField(
        max_length=50,
        choices=GeographyType.choices,
        default=GeographyType.MANUAL,
    )
    geo_address = models.TextField()
    geo_place_id = models.CharField(blank=True)
    geo_latitude = models.DecimalField(
        null=True, blank=True, max_digits=9, decimal_places=6
    )
    geo_longitude = models.DecimalField(
        null=True, blank=True, max_digits=9, decimal_places=6
    )
    hide_address = models.BooleanField(default=False)  # Hide address, except for attendees

    # Publish info
    slug = AutoSlugField(populate_from="title", null=True)
    sales_start = models.DateTimeField(
        help_text=_("When your event sales will start (optional)."),
        blank=True,
        null=True,
    )
    sales_end = models.DateTimeField(
        help_text=_("When your event sales will end (optional)."),
        blank=True,
        null=True,
    )

    # Scanner Info
    scanner_id = models.UUIDField(default=uuid.uuid4)

    class Meta:
        unique_together = [["team", "title"], ["team", "slug"]]

    def __str__(self):
        return f"Event: {self.title}"

    @cached_property
    def tickets_sold_count(self):
        """
        Number of tickets sold.
        """
        return Ticket.objects.filter(event=self).count()

    @cached_property
    def tickets_scanned_count(self):
        """
        Number of tickets scanned.
        """
        return Ticket.objects.filter(event=self, redeemed_at__isnull=False).count()

    @cached_property
    def attendees_count(self):
        """
        Number of ticket holders + guests (for all tickets).
        """
        sold = Ticket.objects.filter(event=self)
        sold_with_party = sold.aggregate(models.Sum("party_size"))["party_size__sum"]
        return sold_with_party or 0

    @cached_property
    def attendees_scanned_count(self):
        """
        Number of ticket holders + guests (for scanned tickets).
        """
        redeemed = Ticket.objects.filter(event=self, redeemed_at__isnull=False)
        redeemed_with_party = redeemed.aggregate(models.Sum("party_size"))[
            "party_size__sum"
        ]
        return redeemed_with_party or 0

    @cached_property
    def description_html(self):
        """
        Used for the Quill editor + rich text description.
        """
        description_html = ""
        try:
            description_html = json.loads(self.description)["html"]
        except Exception:
            pass
        return description_html

    @cached_property
    def currency_symbol(self):
        """
        Not all currencies will have recognizable symbols. If we just store the
        most used ones here locally, we should be good to go for all use cases.

        When used BEFORE amount, we should always be able to handle prices, no
        matter what the currency.
        Example:
            - 29.99 in USD becomes $29.99
            - 500 in Pakistani Rupee becomes PKR 500
        """
        CURRENCY_SYMBOLS = {
            "USD": "$",
            "GBP": "£",
            "EUR": "€",
            "CNY": "¥",
            "INR": "₹",
            "BDT": "৳",  # Bangladesh
            "VND": "₫",  # Vietnam
        }
        return CURRENCY_SYMBOLS.get(self.fiat_currency, self.fiat_currency + " ")

    @cached_property
    def cover_image_url(self):
        """
        Events will always have a placeholder cover image by default.
        """
        if self.cover_image:
            return self.cover_image.url
        else:
            return staticfiles_storage.url("images/event_cover_placeholder.jpg")

    @cached_property
    def ticket_tier_counts(self):
        """
        Used to get the number of available tiers on the checkout app.
        """
        tiers = TicketTier.objects.filter(
            event_id=self.id, hidden_from_public=False
        ).values("event_id")
        tier_counts = {
            "fiat_count": 0,
            "free_count": 0,
            "asset_ownership_count": 0,
            "total_count": 0,
        }
        if not tiers:
            return tier_counts

        # Return tiers with annotated counts
        tier_counts["fiat_count"] = tiers.filter(category=TicketTier.Category.FIAT).count()
        tier_counts["free_count"] = tiers.filter(category=TicketTier.Category.FREE).count()
        tier_counts["asset_ownership_count"] = tiers.filter(
            category=TicketTier.Category.ASSET_OWNERSHIP
        ).count()
        tier_counts["total_count"] = sum(tier_counts.values())
        return tier_counts


class Ticket(DBModel):
    """
    Represents a ticket to an event
    This model supports multiple forms of tickets (PDF, Apple, Google)
    """

    # Keys
    event = models.ForeignKey(
        "Event",
        on_delete=models.CASCADE,
    )
    ticket_tier = models.ForeignKey(
        "TicketTier",
        on_delete=models.CASCADE,
    )
    checkout_item = models.ForeignKey(
        "CheckoutItem",
        on_delete=models.CASCADE,
    )
    checkout_session = models.ForeignKey(
        "CheckoutSession",
        on_delete=models.CASCADE,
    )
    google_class_id = models.CharField(max_length=255, blank=True)

    # Ticket access info
    party_size = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    selected_guests = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    embed_code = models.UUIDField(default=uuid.uuid4)
    redeemed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Ticket: {str(self.id)}"

    def redeem_ticket(self, scanner_id):
        """
        Redeems a ticket (scan via the scanner app).
        """
        # Check if redeemed
        if self.redeemed_at:
            raise AlreadyRedeemedError("Ticket is already redeemed.")

        # # Check if redemption key was passed
        if not scanner_id:
            raise ForbiddenRedemptionError("Access key was not passed in")

        # Check if match on redemption access key
        if self.event.scanner_id != scanner_id:
            raise ForbiddenRedemptionError("Event does not match redemption key")

        # Redeem & save
        self.redeemed_at = timezone.now()
        self.save()

    def get_google_ticket_url(self):
        """
        Retrieve the save URL for the Google ticket
        - create a Google ticket if one doesn't exist, set ID, save object
        - return save URL for success case, False otherwise
        - we use Boolean to handle fail case (not exceptions), because this
          functionality should be non-blocking during fail case
        """
        # Google ticket has not been created
        if self.google_class_id == "":
            response = GoogleTicket.GoogleTicket.create_ticket(ticket_obj=self)
            if 200 <= response.status_code <= 299:
                # Created successfully, we set the ID and save
                self.google_class_id = json.loads(response.text)["id"]
                self.save()
            else:
                # Error while making API request
                rollbar.report_message("get_google_ticket_url ERROR: " + response.text)
                return False

        # Create the save URL and return
        save_url = GoogleTicket.GoogleTicket.get_ticket_url(self.google_class_id)
        return save_url

    def get_apple_ticket_bytes(self):
        """
        Retrieve the bytes for the Apple ticket
        - return bytes for success case, False otherwise
        - we use Boolean to handle fail case (not exceptions), because this
          functionality should be non-blocking during fail case
        """
        try:
            # Create pass and return the bytes
            _pass = AppleTicket.AppleTicket()
            _pass.generate_pass_from_ticket(self)
            return _pass.get_bytes()
        except Exception as e:
            # Error while getting the pass
            rollbar.report_message("APPLE WALLET ERROR: " + str(e))
            return False


class TicketTier(DBModel):
    """
    Represents a ticker tier for a respective ticket.
    This tier contains details for a ticket, ++ pricing and payment method information.
    """

    # key fields
    event = models.ForeignKey(
        "Event",
        on_delete=models.CASCADE,
    )

    # Ticket information fields
    name = models.CharField(
        max_length=255,
        help_text=_("A short descriptive label for your ticket tier."),
    )
    capacity = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text=_("Maximum amount of attendees for your event."),
    )
    max_per_person = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        help_text=_("Maximum amount of tickets per attendee."),
    )
    guests_allowed = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text=_("Maximum number of guests allowed for one ticket."),
    )
    guest_supply = models.IntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        help_text=_("Denotes the total guest capacity."),
    )

    # Display fields
    hidden_from_public = models.BooleanField(
        default=False,
        help_text=_("Whether or not this tier is hidden from the public"),
    )
    hidden_availability = models.BooleanField(
        default=False,
        help_text=_(
            "Whether or not to hide the number of available tickets from the public."
        ),
    )
    additional_information = models.TextField(
        blank=True,
        help_text=_("Additional information for this tier provided by the host."),
    )

    # Category field
    class Category(models.TextChoices):
        FIAT = "FIAT", "Fiat"
        FREE = "FREE", "Free"
        ASSET_OWNERSHIP = "ASSET_OWNERSHIP", "Asset Ownership"

    category = models.CharField(
        max_length=50,
        choices=Category.choices,
        blank=True,
    )

    # Category fields - Asset Ownership
    class BlockchainChoices(models.TextChoices):
        ETH = "ETH", "Ethereum"

    class NetworkChoices(models.IntegerChoices):
        ARBITRUM = 42161, "Arbitrum"
        AVAX_C_CHAIN = 43114, "Avalanche"
        BASE = 8453, "Base"
        BASE_GOERLI = 84531, "Base (Goerli Testnet)"
        BASE_SEPOLIA = 84532, "Base (Sepolia Testnet)"
        BSC = 56, "Binance Smart Chain"
        BSC_TESTNET = 97, "Binance Smart Chain (Testnet)"
        CRONOS = 25, "Cronos"
        ETH = 1, "Ethereum"
        ETH_GOERLI = 5, "Ethereum (Görli Testnet)"
        ETH_HOLESKY = 17000, "Ethereum (Holesky Testnet)"
        ETH_SEPOLIA = 11155111, "Ethereum (Sepolia Testnet)"
        FANTOM = 250, "Fantom"
        GNOSIS = 100, "Gnosis"
        GNOSIS_CHIADO = 10200, "Gnosis (Chiado Testnet)"
        OPTIMISM = 10, "Optimism"
        PALM = 11297108109, "Palm"
        POLYGON = 137, "Polygon"
        POLYGON_MUMBAI = 80001, "Polygon (Mumbai Testnet)"

    class AssetChoices(models.TextChoices):
        NFT = "NFT", "NFT"

    blockchain = models.CharField(
        max_length=50,
        choices=BlockchainChoices.choices,
        default=BlockchainChoices.ETH,
    )
    network = models.IntegerField(
        choices=NetworkChoices.choices,
        default=NetworkChoices.ETH,
        help_text=_("Which blockchain is your NFT collection on?"),
    )
    asset_type = models.CharField(
        max_length=50,
        choices=AssetChoices.choices,
        default=AssetChoices.NFT,
    )
    balance_required = models.IntegerField(
        default=1,
        help_text=_("The number of NFTs required to claim your ticket tier."),
    )
    token_address = models.CharField(
        max_length=42,
        blank=True,
        help_text=_("What is the contract address of your NFT collection?"),
    )
    token_id = ArrayField(
        models.IntegerField(),
        null=True,
        blank=True,
        help_text=_("Which specific token IDs of the NFT collection are required?"),
    )
    deprecated_issued_token_id = ArrayField(
        models.IntegerField(), blank=True, default=list
    )

    # Category fields - Fiat
    price_per_ticket = models.DecimalField(
        max_digits=19,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text=_("Price of one ticket for this tier."),
        default=0,
    )

    # Category fields - Free
    deprecated_issued_emails = ArrayField(models.EmailField(), blank=True, default=list)

    class Meta:
        ordering = ("-modified",)

    def __str__(self):
        return f"TicketTier: {self.name}"

    @cached_property
    def tickets_sold_count(self):
        """
        Number of tickets sold.
        """
        return Ticket.objects.filter(ticket_tier=self).count()

    @cached_property
    def tickets_available(self):
        """
        Number of tickets available for sale.
        """
        return self.capacity - self.tickets_sold_count

    @cached_property
    def tickets_sold_exceeding_capacity(self):
        """
        In case of overflow, where number of tickets sold exceeds the capacity.
        """
        return abs(int(self.capacity - self.tickets_sold_count))

    @cached_property
    def guests_count(self):
        """
        Number of guests.
        """
        sold = Ticket.objects.filter(ticket_tier=self)
        sold_with_party = sold.aggregate(models.Sum("party_size"))["party_size__sum"] or 0
        return sold_with_party - self.tickets_sold_count

    @cached_property
    def guests_available(self):
        """
        Number of guests available for allocation.
        """
        if self.guest_supply:
            return self.guest_supply - self.guests_count
        else:
            return False

    @cached_property
    def additional_information_html(self):
        """
        Support for HTML on the additional_information field.
        """
        additional_information_html = ""
        try:
            additional_information_html = json.loads(self.additional_information)["html"]
        except Exception:
            pass
        return additional_information_html

    @cached_property
    def price_per_ticket_cents(self):
        """
        Convert the price per ticket to cents.
        """
        return round(self.price_per_ticket * 100)


class CheckoutSession(DBModel):
    """
    Represents a time-limited checkout session (aka 'cart') for an event organizer
    This model holds the relations to cart items for checkout purposes
    """

    # Key fields
    event = models.ForeignKey(
        "Event",
        on_delete=models.CASCADE,
    )
    rsvp_batch = models.ForeignKey(
        "RSVPBatch",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    # Checkout session information fields
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    passcode = models.CharField(max_length=6, default=get_random_passcode)

    # Session Status field
    class OrderStatus(models.TextChoices):
        VALID = "VALID", "Valid"  # Initial State. Session is valid.
        PROCESSING = "PROCESSING", "Processing"  # Session has entered processing
        FAILED = "FAILED", "Failed"  # TX has failed
        FULFILLED = "FULFILLED", "Fulfilled"  # TX has been filled

    order_status = models.CharField(
        max_length=50,
        choices=OrderStatus.choices,
        default=OrderStatus.VALID,
    )

    # Waitlist Status field
    class WaitlistStatus(models.TextChoices):
        WAITLIST_JOINED = "WAITLIST_JOINED", "Waitlist joined"
        WAITLIST_APPROVED = "WAITLIST_APPROVED", "Waitlist approved"
        WAITLIST_REJECTED = "WAITLIST_REJECTED", "Waitlist rejected"

    waitlist_status = models.CharField(
        max_length=50,
        choices=WaitlistStatus.choices,
        blank=True,
    )

    # Session Type Field
    class SessionType(models.TextChoices):
        FIAT = "FIAT", "Fiat"
        FREE = "FREE", "Free"
        ASSET_OWNERSHIP = "ASSET_OWNERSHIP", "Asset Ownership"

    session_type = models.CharField(
        max_length=50,
        choices=SessionType.choices,
        default=SessionType.FIAT,
    )

    # Session Type Fields - Fiat
    stripe_session_id = models.CharField(
        max_length=255,
        blank=True,
        help_text=_("Stripe checkout session ID."),
    )
    stripe_session_url = models.TextField(
        blank=True,
        help_text=_("Stripe checkout session URL."),
    )
    stripe_line_items = models.JSONField(blank=True, null=True)

    # Session Type Fields - Asset Ownership
    wallet_address = models.CharField(max_length=42, blank=True)
    signed_message = models.TextField(blank=True)
    is_wallet_address_verified = models.BooleanField(blank=True, null=True)
    delegated_wallet = models.BooleanField(blank=True, null=True)
    redeemed_nfts = models.JSONField(blank=True, default=list)

    def __str__(self):
        return f"CheckoutSession: {self.email}"

    @cached_property
    def get_tickets_link(self):
        """
        Get link to get the tickets for this session
        """
        domain = Site.objects.all().first().domain
        domain = f"http://{domain}"  # http works in local, converted to https on prod
        url = reverse(
            "checkout:get_tickets",
            args=[
                self.public_id,
            ],
        )
        tickets_link = domain + url
        return tickets_link

    @cached_property
    def total_price(self):
        """
        Calculate the total price of all the checkout items in the session.
        Only used for FIAT tiers for now.
        """
        if self.session_type == CheckoutSession.SessionType.FIAT:
            total_price = 0
            checkout_items = CheckoutItem.objects.select_related("ticket_tier").filter(
                checkout_session=self
            )
            for item in checkout_items:
                tier_price = item.ticket_tier.price_per_ticket
                total_price += item.quantity * tier_price
            return total_price
        else:
            return "N/A"

    @cached_property
    def stripe_checkout_cancel_link(self):
        """
        Link to return to in case the Stripe payment session is cancelled.
        """
        domain = Site.objects.all().first().domain
        domain = f"http://{domain}"  # http works in local, converted to https on prod
        token = jwt.encode(
            {"public_id": str(self.public_id)},
            settings.STRIPE_API_KEY,
            algorithm="HS256",
        )
        url = reverse(
            "checkout:stripe_checkout_cancel",
            args=[
                self.event.team.slug,
                self.event.slug,
                self.public_id,
                token,
            ],
        )
        return domain + url

    @cached_property
    def stripe_checkout_success_link(self):
        """
        Link to return to in case the Stripe payment session is fulfilled 
        successfully, ie, payment is made.
        """
        domain = Site.objects.all().first().domain
        domain = f"http://{domain}"  # http works in local, converted to https on prod
        token = jwt.encode(
            {"public_id": str(self.public_id)},
            settings.STRIPE_API_KEY,
            algorithm="HS256",
        )
        url = reverse(
            "checkout:stripe_checkout_success",
            args=[
                self.event.team.slug,
                self.event.slug,
                self.public_id,
                token,
            ],
        )
        return domain + url

    @cached_property
    def application_fee_amount(self):
        """
        Application fee that will be requested to be applied to the payment,
        & transferred to the application owner’s Stripe account.

        Current model is 4% + $2 Per Ticket (i.e., $100 ticket we would take $6)
        """
        items = self.checkoutitem_set.all()
        application_fee_amount = 0
        per_ticket = 0.04
        flat_fee = 200
        for i in items:
            application_fee_amount += (i.unit_amount * per_ticket) + flat_fee
        application_fee_amount = round(application_fee_amount)
        return application_fee_amount

    @cached_property
    def unsigned_message(self):
        """
        Used during the NFT verification process.
        """
        return (
            "Greetings from SocialPass."
            "\nSign this message to prove ownership"
            "\n\nThis IS NOT a trade or transaction"
            f"\n\nTimestamp: {self.created.strftime('%s')}"
            f"\nOne-Time Code: {str(self.public_id)}"
        )

    def send_confirmation_email(self, custom_message=None):
        """
        Send the confirmation link to the attendee's email
        """
        ctx = {
            "event": self.event,
            "tickets_link": self.get_tickets_link,
            "passcode": self.passcode,
            "custom_message": custom_message,
        }
        msg_plain = render_to_string("ticket/email/checkout_message.txt", ctx)
        msg_html = render_to_string("ticket/email/checkout.html", ctx)
        send_mail(
            "[SocialPass] Tickets for " + self.event.title,
            msg_plain,
            "tickets-no-reply@socialpass.io",
            [self.email],
            html_message=msg_html,
        )

    def create_tickets(self):
        """
        Create Tickets for all related checkout_item objects and bulk insert 
        into the database.
        """
        tickets_to_create = []
        for checkout_item in self.checkoutitem_set.all():
            ticket_keys = {
                "checkout_session": checkout_item.checkout_session,
                "checkout_item": checkout_item,
                "event": checkout_item.checkout_session.event,
                "ticket_tier": checkout_item.ticket_tier,
                "selected_guests": checkout_item.selected_guests,
                "party_size": checkout_item.selected_guests + 1,
            }
            tickets_to_create.extend(
                [Ticket(**ticket_keys) for _ in range(checkout_item.quantity)]
            )
        Ticket.objects.bulk_create(tickets_to_create)

    def process_session(self):
        """
        Responsible for processing the correct transaction based on session_type
        """
        match self.session_type:
            case CheckoutSession.SessionType.FREE:
                self.process_free()
            case CheckoutSession.SessionType.FIAT:
                self.process_fiat()
            case CheckoutSession.SessionType.ASSET_OWNERSHIP:
                self.process_asset_ownership()
            case _:
                pass

    def fulfill_session(self):
        """
        Create tickets, send confirmation email, and set as FULFILLED.
        Also wrap in try/catch for better error reporting.
        """
        try:
            self.create_tickets()
            self.send_confirmation_email()
            self.order_status = CheckoutSession.OrderStatus.FULFILLED
            self.save()
        except Exception:
            rollbar.report_exc_info()

    def process_fiat(self):
        """
        Go through the states.
        """
        self.order_status = CheckoutSession.OrderStatus.PROCESSING
        self.save()

    def process_free(self):
        """
        Go through the states, only stop to check for issued emails.
        """
        self.order_status = CheckoutSession.OrderStatus.PROCESSING
        self.save()

        # Check for duplicate emails
        duplicate_emails = CheckoutSession.objects.filter(
            event=self.event,
            email=self.email,
            session_type=CheckoutSession.SessionType.FREE,
        ).exclude(id=self.id)
        if duplicate_emails:
            self.order_status = CheckoutSession.OrderStatus.FAILED
            self.save()
            raise FreeCheckoutError(
                f"The email ({self.email}) has already been used for this event."
            )

    def _process_wallet_address(self):
        """
        Recover a wallet address from the signed_message vs unsigned_message
        - On success: Mark is_wallet_address_verified as True
        - On error: Raise AssetOwnershipCheckoutError, mark session.order_status as FAILED
        Once this wallet address has been verified, set is_wallet_address_verified
        """
        # Recover wallet address
        # Handle encoding / decoding exception (usually forgery attempt)
        try:
            _msg = encode_defunct(text=self.unsigned_message)
            recovered_address = Account.recover_message(
                _msg, signature=self.signed_message
            )
        except Exception as e:
            rollbar.report_message("AssetOwnershipCheckoutError ERROR: " + str(e))
            self.order_status = CheckoutSession.OrderStatus.FAILED
            raise AssetOwnershipCheckoutError("Error recovering wallet address")

        # Successful recovery attempt
        # Now check if addresses match
        if recovered_address != self.wallet_address:
            self.order_status = CheckoutSession.OrderStatus.FAILED
            raise AssetOwnershipCheckoutError("Address was recovered, but did not match")

        # Success, mark as verified
        self.is_wallet_address_verified = True
        self.save()

    def _process_delegate_ownership(self, wallet_address=None, tier=None):
        # 1. The first step is to get all the incoming delegations from the wallet that wants to claim the ticket.
        import requests

        url = (
            f"https://api.delegate.xyz/registry/v2/{wallet_address}?chainId={tier.network}"
        )
        response = requests.get(url)
        incomingDelegations = response.json()
        delegated_wallets = []

        # 2. Filter out these delegations to only include the NFT Contact you are looking to claim tickets for.
        filteredDelegations = [
            delegation
            for delegation in incomingDelegations
            if delegation["type"] == "ALL"
            or (
                delegation["type"] == "CONTRACT"
                and delegation["contract"] == tier.token_address
            )
            or (
                delegation["type"] == "ERC721"
                and delegation["contract"] == tier.token_address
            )
        ]

        # Get all the NFTs of each unique from address in the above list and return
        delegated_wallets = set(delegation["from"] for delegation in filteredDelegations)
        if not delegated_wallets:
            raise AssetOwnershipCheckoutError("No delegated wallets found.")

        # OK
        return list(delegated_wallets)

    def _process_asset_ownership(self):
        filtered_by_expected = []
        for item in self.checkoutitem_set.all():
            ticket_tier = item.ticket_tier
            # Set wallet addresses
            # Either single address, or list of delegated wallets
            if self.delegated_wallet:
                wallets = self._process_delegate_ownership(
                    wallet_address=self.wallet_address, tier=ticket_tier
                )
            else:
                wallets = [self.wallet_address]

            for wallet in wallets:
                # Format & make API lookup
                params = {
                    "chain": hex(ticket_tier.network),
                    "format": "decimal",
                    "media_items": True,
                    "address": wallet,
                    "token_addresses": [ticket_tier.token_address],
                }
                api_response = evm_api.nft.get_wallet_nfts(
                    api_key=settings.MORALIS_API_KEY,
                    params=params,
                )

                # Check if wallet has required balance
                expected = ticket_tier.balance_required * item.quantity
                if api_response.get("result"):
                    actual = len(api_response["result"])
                else:
                    actual = 0
                if actual < expected:
                    if wallet == wallets[-1]:
                        raise AssetOwnershipCheckoutError(
                            (
                                "Quantity requested exceeds the queried balance. "
                                f"Expected Balance: {expected}. "
                                f"Actual Balance: {actual}."
                            )
                        )
                    else:
                        continue

                # Check if wallet has un-redeemed NFTs
                existing_ids = set(
                    int(i.get("token_id"))
                    for nfts in CheckoutItem.objects.filter(
                        ticket_tier=ticket_tier,
                        checkout_session__event=self.event,
                        checkout_session__redeemed_nfts__contains=[
                            {"token_address": ticket_tier.token_address.lower()}
                        ],
                    ).values_list("checkout_session__redeemed_nfts", flat=True)
                    for i in nfts
                )
                filtered_by_issued_ids = [
                    nft
                    for nft in api_response["result"]
                    if int(nft["token_id"]) not in existing_ids
                ]
                actual = len(filtered_by_issued_ids)
                if actual < expected:
                    if wallet == wallets[-1]:
                        raise AssetOwnershipCheckoutError(
                            (
                                f"Could not find enough NFT's. "
                                f"Expected unique NFT's: {expected}. "
                                f"Actual unique NFT's: {actual}."
                            )
                        )
                    else:
                        continue

                # OK
                filtered_by_expected += filtered_by_issued_ids[:expected]
                break

        # 4. OK - Set redeemed NFTs & Save
        self.redeemed_nfts = filtered_by_expected
        self.save()

    def process_asset_ownership(self):
        # Set session as processing
        self.order_status = CheckoutSession.OrderStatus.PROCESSING
        self.save()

        # try / catch on process methods
        try:
            self._process_wallet_address()
            self._process_asset_ownership()
        except AssetOwnershipCheckoutError as e:
            self.order_status = CheckoutSession.OrderStatus.FAILED
            self.save()
            raise e
        except Exception as e:
            self.order_status = CheckoutSession.OrderStatus.FAILED
            self.save()
            raise e


class CheckoutItem(DBModel):
    """
    Represents items selected for checkout (aka 'cart items') by an event attendee
    This model is mapped to a specific ticket tier, as well as a specific ticket
    """

    # keys
    ticket_tier = models.ForeignKey(
        "TicketTier",
        on_delete=models.CASCADE,
    )
    checkout_session = models.ForeignKey(
        "CheckoutSession",
        on_delete=models.CASCADE,
    )

    # basic info
    quantity = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        blank=True,
    )
    selected_guests = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
    )

    def __str__(self):
        return f"CheckoutItem: {str(self.id)}"

    @cached_property
    def unit_amount(self):
        """
        Get the total price of the checkout item in cents. Only used for FIAT 
        tiers for now.
        """
        if not self.ticket_tier.category == TicketTier.Category.FIAT:
            return "N/A"

        price_per_ticket_cents = self.ticket_tier.price_per_ticket_cents
        unit_amount = price_per_ticket_cents * self.quantity
        return unit_amount


class RSVPBatch(DBModel):
    """
    Represents a batch of tickets created using the RSVP system
    """

    event = models.ForeignKey(
        "Event",
        on_delete=models.CASCADE,
    )
    ticket_tier = models.ForeignKey("TicketTier", on_delete=models.CASCADE, null=True)
    success_list = ArrayField(models.EmailField(), blank=True, default=list)
    failure_list = ArrayField(models.EmailField(), blank=True, default=list)

    def __str__(self) -> str:
        return f"RSVPBatch: {self.public_id}"


class MessageBatch(DBModel):
    """
    Represents a batch of messages sent to ticket holders of a particular tier.
    """

    event = models.ForeignKey(
        "Event",
        on_delete=models.CASCADE,
    )
    ticket_tier = models.ForeignKey(
        "TicketTier",
        on_delete=models.CASCADE,
    )
    subject = models.CharField(max_length=255)
    message = models.TextField()
    total_recipients = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    def __str__(self) -> str:
        return f"MessageBatch: {self.public_id}"
