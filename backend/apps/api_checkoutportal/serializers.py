import copy

from django.templatetags.static import static
from rest_framework import serializers

from apps.root.models import Event, Team, Ticket


class TeamSerializer(serializers.ModelSerializer):
    """
    Team serializer
    """

    image = serializers.SerializerMethodField()
    theme = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ["name", "image", "theme"]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            image_url = obj.image.url
            return request.build_absolute_uri(image_url)
        else:
            return None

    def get_theme(self, obj):
        request = self.context.get("request")
        theme = copy.deepcopy(obj.theme)

        # theme does not exist
        # return None
        if not theme:
            return None

        if "logo" in obj.theme:
            theme["logo"] = request.build_absolute_uri(static(obj.theme["logo"]))

        if "favicon" in obj.theme:
            theme["favicon"] = request.build_absolute_uri(static(obj.theme["favicon"]))

        if "css_theme" in obj.theme:
            theme["css_theme"] = request.build_absolute_uri(
                static(obj.theme["css_theme"])
            )

        return theme


class EventSerializer(serializers.ModelSerializer):
    """
    Event serializer
    """

    ticket_count = serializers.IntegerField(source="tickets.count", read_only=True)
    start_date = serializers.DateTimeField(format="%A, %B %d, %Y | %H:%M%p")
    team = TeamSerializer()

    class Meta:
        model = Event
        fields = [
            "team",
            "title",
            "description",
            "requirements",
            "limit_per_person",
            "start_date",
            "timezone",
            "localized_address_display",
            "capacity",
            "ticket_count",
            "cover_image",
            "show_ticket_count",
            "show_team_image",
        ]
