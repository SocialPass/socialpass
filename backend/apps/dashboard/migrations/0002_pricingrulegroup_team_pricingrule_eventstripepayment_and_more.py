# Generated by Django 4.0.4 on 2022-06-16 05:35

import uuid

import apps.dashboard.models
import django.core.validators
import django.db.models.deletion
import django.db.models.expressions
import django.utils.timezone
import model_utils.fields
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("root", "0003_remove_pricingrule_group_remove_team_members_and_more"),
        ("dashboard", "0001_initial"),
    ]

    state_operations = [
        migrations.CreateModel(
            name="PricingRuleGroup",
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
                    models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True),
                ),
                ("name", models.CharField(max_length=100)),
                ("description", models.TextField(blank=True, null=True)),
            ],
            options={
                "abstract": False,
            },
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
                (
                    "public_id",
                    models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True),
                ),
                ("name", models.CharField(max_length=255)),
                (
                    "image",
                    models.ImageField(blank=True, max_length=255, null=True, upload_to=""),
                ),
                ("description", models.TextField(blank=True)),
                (
                    "members",
                    models.ManyToManyField(through="dashboard.Membership", to=settings.AUTH_USER_MODEL),
                ),
                (
                    "pricing_rule_group",
                    models.ForeignKey(
                        default=apps.dashboard.models.Team.get_default_pricing_rule_group,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="dashboard.pricingrulegroup",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="PricingRule",
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
                    models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True),
                ),
                (
                    "min_capacity",
                    models.IntegerField(validators=[django.core.validators.MinValueValidator(1)]),
                ),
                ("max_capacity", models.IntegerField(blank=True, null=True)),
                (
                    "price_per_ticket",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        validators=[django.core.validators.MinValueValidator(0)],
                    ),
                ),
                ("active", models.BooleanField(default=True)),
                (
                    "group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="pricing_rules",
                        to="dashboard.pricingrulegroup",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="EventStripePayment",
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
                    models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True),
                ),
                (
                    "value",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        validators=[django.core.validators.MinValueValidator(0)],
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("PENDING", "Pending"),
                            ("PROCESSING", "Processing"),
                            ("CANCELLED", "Cancelled"),
                            ("SUCCESS", "Succeeded"),
                            ("FAILURE", "Failed"),
                        ],
                        default="PENDING",
                        max_length=30,
                    ),
                ),
                ("stripe_checkout_session_id", models.CharField(max_length=1024)),
                ("callaback_timestamp", models.DateTimeField(blank=True, null=True)),
                (
                    "acknowledgement_timestamp",
                    models.DateTimeField(blank=True, null=True),
                ),
                (
                    "event",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.RESTRICT,
                        related_name="payments",
                        to="root.event",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AlterField(
            model_name="invite",
            name="team",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="dashboard.team",
            ),
        ),
        migrations.AlterField(
            model_name="membership",
            name="team",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="dashboard.team",
            ),
        ),
        migrations.AddConstraint(
            model_name="pricingrule",
            constraint=models.CheckConstraint(
                check=models.Q(
                    ("max_capacity__isnull", True),
                    (
                        "max_capacity__gt",
                        django.db.models.expressions.F("min_capacity"),
                    ),
                    _connector="OR",
                ),
                name="dashboard_pricingrule_max_capacity__gt__min_capacity",
            ),
        ),
    ]

    operations = [migrations.SeparateDatabaseAndState(state_operations=state_operations)]
