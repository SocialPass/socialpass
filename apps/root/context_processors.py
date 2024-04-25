import os

def export_vars(request):
	data = {}
	print("HELLO")
	print(os.environ['GOOGLE_MAPS_API_KEY'])
	data['GOOGLE_MAPS_API_KEY'] = os.environ['GOOGLE_MAPS_API_KEY']
	return data