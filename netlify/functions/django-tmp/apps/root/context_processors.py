from django.conf import settings


def export_vars(request):
    data = {}
    data["GOOGLE_MAPS_API_KEY"] = settings.GOOGLE_MAPS_API_KEY
    return data
