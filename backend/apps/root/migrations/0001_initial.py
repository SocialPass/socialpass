# Generated by Django 3.2.11 on 2022-04-14 01:59

import apps.root.models
import apps.root.validators
from django.conf import settings
import django.contrib.auth.validators
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("contenttypes", "0002_remove_content_type_name"),
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        error_messages={
                            "unique": "A user with that username already exists."
                        },
                        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
                        max_length=150,
                        unique=True,
                        validators=[
                            django.contrib.auth.validators.UnicodeUsernameValidator()
                        ],
                        verbose_name="username",
                    ),
                ),
                (
                    "first_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="first name"
                    ),
                ),
                (
                    "last_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="last name"
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        blank=True, max_length=254, verbose_name="email address"
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(
                        default=True,
                        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                        verbose_name="active",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.Group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.Permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "user",
                "verbose_name_plural": "users",
                "abstract": False,
            },
            managers=[
                ("objects", apps.root.models.CustomUserManager()),
            ],
        ),
        migrations.CreateModel(
            name="Membership",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Team",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                (
                    "image",
                    models.ImageField(
                        blank=True, max_length=255, null=True, upload_to=""
                    ),
                ),
                ("details", models.TextField(blank=True)),
                (
                    "software_types",
                    models.JSONField(
                        default=list,
                        validators=[
                            apps.root.validators.JSONSchemaValidator(
                                limit_value={
                                    "items": {"enum": ["TICKET"], "type": "string"},
                                    "minItems": 1,
                                    "type": "array",
                                }
                            )
                        ],
                    ),
                ),
                (
                    "subdomain",
                    models.CharField(
                        max_length=256,
                        null=True,
                        unique=True,
                        validators=[
                            django.core.validators.RegexValidator(
                                "^[0-9a-zA-Z]*$",
                                message="Subdomain only allows alphanumeric",
                            )
                        ],
                    ),
                ),
                (
                    "members",
                    models.ManyToManyField(
                        through="root.Membership", to=settings.AUTH_USER_MODEL
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="TokenGate",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                (
                    "public_id",
                    models.UUIDField(
                        db_index=True, default=uuid.uuid4, editable=False, unique=True
                    ),
                ),
                ("title", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True)),
                (
                    "general_type",
                    models.CharField(choices=[("TICKET", "TICKET")], max_length=50),
                ),
                (
                    "requirements",
                    models.JSONField(
                        blank=True,
                        default=list,
                        null=True,
                        validators=[
                            apps.root.validators.JSONSchemaValidator(
                                limit_value={
                                    "format": "tabs",
                                    "items": {
                                        "properties": {
                                            "amount": {
                                                "format": "number",
                                                "minimum": 1,
                                                "title": "Required Amount",
                                                "type": "integer",
                                            },
                                            "asset_address": {
                                                "pattern": "^(0x|0X).*$",
                                                "title": "Asset Address",
                                                "type": "string",
                                            },
                                            "asset_type": {
                                                "enum": ["ERC20", "ERC721", "ERC1155"],
                                                "title": "Asset Type",
                                                "type": "string",
                                            },
                                            "blockchain": {
                                                "enum": ["EVM"],
                                                "title": "Blockchain",
                                                "type": "string",
                                            },
                                            "chain_id": {
                                                "enum": [1, 2, 4, 56, 43114, 137],
                                                "title": "Network",
                                                "type": "integer",
                                            },
                                            "to_block": {
                                                "format": "number",
                                                "minimum": 1,
                                                "title": "Snapshot block (for fungible tokens)",
                                                "type": "integer",
                                            },
                                            "token_id": {
                                                "items": {
                                                    "title": "Token ID",
                                                    "type": "integer",
                                                },
                                                "minItems": 0,
                                                "title": "Token IDs",
                                                "type": "array",
                                            },
                                        },
                                        "required": [
                                            "blockchain",
                                            "asset_address",
                                            "amount",
                                            "chain_id",
                                            "asset_type",
                                        ],
                                        "title": "Requirement",
                                        "type": "object",
                                    },
                                    "properties": {},
                                    "title": "Blockchain Requirements",
                                    "type": "array",
                                }
                            )
                        ],
                    ),
                ),
                (
                    "limit_per_person",
                    models.IntegerField(
                        default=1,
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(100),
                        ],
                    ),
                ),
                ("featured", models.BooleanField(default=False)),
                (
                    "polymorphic_ctype",
                    models.ForeignKey(
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="polymorphic_root.tokengate_set+",
                        to="contenttypes.contenttype",
                    ),
                ),
                (
                    "team",
                    models.ForeignKey(
                        blank=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="tokengates",
                        to="root.team",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="tokengates",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="TicketGate",
            fields=[
                (
                    "tokengate_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="root.tokengate",
                    ),
                ),
                ("date", models.DateTimeField()),
                (
                    "timezone",
                    models.CharField(
                        max_length=30, null=True, verbose_name="time zone"
                    ),
                ),
                ("location", models.CharField(max_length=1024)),
                (
                    "capacity",
                    models.IntegerField(
                        validators=[django.core.validators.MinValueValidator(1)]
                    ),
                ),
                (
                    "scanner_code",
                    models.CharField(
                        default=apps.root.models.TicketGate.set_scanner_code,
                        max_length=1024,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
            bases=("root.tokengate",),
        ),
        migrations.CreateModel(
            name="Signature",
            fields=[
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                (
                    "unique_code",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("signing_message", models.CharField(max_length=1024)),
                ("wallet_address", models.CharField(max_length=400)),
                ("is_verified", models.BooleanField(default=False)),
                ("expires", models.DateTimeField()),
                ("version", models.IntegerField(default=1)),
                (
                    "tokengate",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="signatures",
                        to="root.tokengate",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AddField(
            model_name="membership",
            name="team",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="root.team",
            ),
        ),
        migrations.AddField(
            model_name="membership",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.CreateModel(
            name="Ticket",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                ("filename", models.UUIDField(default=uuid.uuid4, editable=False)),
                (
                    "embed_code",
                    models.CharField(
                        default=apps.root.models.Ticket.set_embed_code, max_length=1024
                    ),
                ),
                ("wallet_address", models.CharField(max_length=400)),
                ("token_id", models.IntegerField(blank=True, null=True)),
                (
                    "image",
                    models.ImageField(
                        blank=True, max_length=255, null=True, upload_to=""
                    ),
                ),
                ("temporary_download_url", models.TextField(blank=True, null=True)),
                ("redeemed", models.BooleanField(default=False)),
                (
                    "signature",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="tickets",
                        to="root.signature",
                    ),
                ),
                (
                    "tokengate",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="tickets",
                        to="root.ticketgate",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AlterUniqueTogether(
            name="membership",
            unique_together={("team", "user")},
        ),
    ]
