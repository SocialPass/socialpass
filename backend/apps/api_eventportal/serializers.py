from rest_framework import serializers
from apps.root.models import Signature, Team, Ticket, TicketedEvent


class TicketedEventSerializer(serializers.ModelSerializer):
    team_info = serializers.SerializerMethodField()
    ticket_info = serializers.SerializerMethodField()
    event_info = serializers.SerializerMethodField()

    class Meta:
        model = TicketedEvent
        fields = [
            "team_info",
            "ticket_info",
            "event_info",
        ]

    def get_ticket_info(self, obj):
        current_ticket_count = obj.tickets.count()
        if current_ticket_count + obj.limit_per_person > obj.capacity:
            ticket_limit = obj.capacity - current_ticket_count
        else:
            ticket_limit = obj.limit_per_person

        return {
            "capacity":obj.capacity,
            "current_tickets": current_ticket_count,
            "ticket_limit": ticket_limit,
        }

    def get_team_info(self, obj):
        return {
            "name": obj.team.name,
            #"profile_image":  obj.team.image
        }
    def get_event_info(self, obj):
        return {
           "title": obj.title,
           "description": obj.description,
           "requirements": obj.requirements,
           "date": obj.date,
           "timezone": obj.timezone,
           "location": obj.location,
           "capacity": obj.capacity,
        }

