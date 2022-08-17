import json, os, re, uuid

from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account
from google.auth import jwt, crypt


class GoogleTicket:
	"""
	Model for Google Wallet tickets.
	"""
	@staticmethod
	def get_service_account_info():
		"""
		Get the service account credentials.
		"""
		return {
			"type": "service_account",
			"project_id": "socialpass-358508",
			"private_key_id": "eb6ee15b2777763f54a43ffd62bc2825017d4ff6",
			"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3t0XFBeg8CCEs\nHsL0ofIGHjYT6pW2D4SU9HCByNg7FAiqTsbrFEcAQ7Va4sWUS80z0yQaDeA5rJDX\nwYFGCNRvTf0vl7xBptN/BHlg+ZNrzfa95DBgMvDiOj9jOdUwmzs6zRTlHejN4suX\nLRWeRpZB+WRBf4auAtgjzTr63BNaJ6Spzoc9Dv7ODW3TnIMK/R9m/PJb1D4INqYk\n9Bg8To4jKUPUhsDaiHC/sO758cpO1FDf25UQJtJpzC70IVfFoAlKJnyJ+NWZHVSa\n+jNoRtyumzwevYI9nMPHxPWQhbvxaQcb+TCDGO73bAn3tuSPOeL/PaCEAFmyrAnB\n9BhnigiLAgMBAAECggEAGhZ/ZNP1lMNpb9TKcGdSxpr2/kBbPr2DYTeOMQ/ZN20d\nMeSlNe/s3n++5Vy7G9eLwyaMw4UMPdm1vmhEYt08IAtzaZUNbvExVUxzBASiHOE5\nfuDuxv+qLyXVpyco5pG/M8Fi4d+BFe4fuk70+UMixn7omq3GQo2K2G1QnnDZRVLf\npWPVGBFM4n2Nz8Zqoerq9BkhrRedTxk31BwG5CMdLuVYoPFtEVJ0US+z/ZiRHTW8\noO9OwpWYH5UMvp/mnzE3nk2OXMFzXmkCvHH42zEM30qd7liXxR6JMNhSx5dvvIDH\ngT/ThLeVbo1iXnubUseUIJJaKQSeGzF6FekGEUWQ4QKBgQD41Eso7XlyIlHkUJdT\nPkINvNHz7Qh+VZIzUmI6x73k8Lc3gJHttVIzVWLZO2PPjDzIHdCDNbM7Q8aLWXwU\nozx8ACtppqiZPOKPmlqf4ASlA4UoDVgtDyQlDTyiq2VNeJc6hfuknOCBr2IsBmcq\nXfaYD13LvqFUUfg913qCqhA1cQKBgQC9Ap0FKzwtROd6Sm4CUc8nS3uI5xS+kZcx\nDPuUL/y0QUtk2bMPyhcsvvvUqThv6g+hS4yPGdRop6dsgUr0k+H8DMw+639mUGQA\nDx52jXEiq5FkLDYGUtZzcqYUYWlm0TK8115A0IqLNN7T+qo0+moQPVoC6Ql59mUR\n2W0Rv3dvuwKBgQCOMWrd8Y7kHR6lFTTUmhBPH2bvOLYQ07+fWmXN51Tp3nEk43EA\n4QwfT50UPG8WLLKTPQ5p3KcWp+1utm1Esd+fkM0+K8HPB88EdxVwpSiiT7epIq8P\n2MYz8jODVeSm99Gb3PLnp8pX8axtMh+EQ3vme2mDQ+WXdNwiIt/ciWiH0QKBgDgg\n/Iw6aKZw3eTdEYoyzTe4HLltFiX5ilKQrm01SvAkq8UJOTmpI/Svyo0+q3ngoj+d\n9eHRI9joYLnCM4YqHGQDUOwmdzDlEq1J0BwYqM5I8OY0kt6R3wlttJA81VYpLc4S\njvTkeSAZ1UpSGBWff7vO3Foc5imH2D/St6cbmtZdAoGBANX6uVZ9eF6YPfpkKrlA\niTqvPTq8x9S9FXfPDUbDH7iqpStBgly+Mwv7KqRAC9vTzZhKjIRczX8MqlAG4h9X\n6VJdSB2l59r3I+ybZnWfRIFlFatw4pBdyAgFcBzsX2WLxAFaSN5tJk5fVzijFFec\n4XV8ZxY931lL5Brrxf/f1mTg\n-----END PRIVATE KEY-----\n",
			"client_email": "wallet-web-client@socialpass-358508.iam.gserviceaccount.com",
			"client_id": "114019881192262882667",
			"auth_uri": "https://accounts.google.com/o/oauth2/auth",
			"token_uri": "https://oauth2.googleapis.com/token",
			"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
			"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/wallet-web-client%40socialpass-358508.iam.gserviceaccount.com"
		}

	@staticmethod
	def authenticate(service_account_info, scopes):
		"""
		Authenticate with the Google API.
		"""
		credentials = service_account.Credentials.from_service_account_info(
			service_account_info, scopes=scopes
		)
		http_client = AuthorizedSession(credentials)

		return http_client

	@staticmethod
	def get_issuer_id():
		"""
		Get the issuer ID.
		"""
		return os.environ.get("GOOGLE_WALLET_ISSUER_ID")

	@staticmethod
	def get_ticket_class_payload(event_obj):
		"""
		Get the payload for inserting/updating a ticket class.
		"""
		# Create the address from the fields
		address = ""
		if event_obj.address_1:
			address += event_obj.address_1 + "\n"
		if event_obj.address_2:
			address += event_obj.address_2 + "\n"

		address_items_list = []
		if event_obj.city:
			address_items_list.append(event_obj.city)
		if event_obj.region:
			address_items_list.append(event_obj.region)
		if event_obj.postal_code:
			address_items_list.append(event_obj.postal_code)
		if event_obj.country:
			address_items_list.append(event_obj.country)
		address += ", ".join(address_items_list)


		# Create the payload
		payload = {
			"eventName": {
				"defaultValue": {
					"language": "en-us",
					"value": event_obj.title
				}
			},
			"issuerName": "SocialPass",
			"reviewStatus": "UNDER_REVIEW",
			"dateTime": {
				"start": event_obj.start_date.isoformat(),
				"end": event_obj.end_date.isoformat()
			},
			"venue": {
				"name": {
					"defaultValue": {
						"language": "en-us",
						"value": event_obj.location
					}
				},
				"address": {
					"defaultValue": {
						"language": "en-us",
						"value": address
					}
				}
			},
			"logo": {
				"sourceUri": {
					"uri": "https://res.cloudinary.com/nfty-labs/image/upload/v1660211657/socialpass-ticket-logo_lzcnkm.png"
				}
			},
			"hexBackgroundColor": "#ef7c4e"
		}

		# Add the latitude and longitude (if available)
		if event_obj.lat and event_obj.long:
			payload["locations"] = [
				{
					"latitude": float(event_obj.lat),
					"longitude": float(event_obj.long)
				}
			]

		return payload

	@staticmethod
	def insert_update_ticket_class(event_obj, is_insert=True):
		"""
		Insert/update a ticket class. Call post-save when an Event object is 
		created/updated.
		"""
		service_account_info = GoogleTicket.get_service_account_info()
		http_client = GoogleTicket.authenticate(
			service_account_info=service_account_info,
			scopes=["https://www.googleapis.com/auth/wallet_object.issuer"],
		)
		class_id = "%s.%s" % (
			GoogleTicket.get_issuer_id(), str(event_obj.public_id)
		)
		url = "https://walletobjects.googleapis.com/walletobjects/v1/eventTicketClass"
		payload = GoogleTicket.get_ticket_class_payload(event_obj)

		# Insert or update the ticket class
		if is_insert:
			payload["id"] = class_id
			response = http_client.post(url, json=payload)
		else:
			url = url + "/" + class_id
			response = http_client.patch(url, json=payload)

		return json.loads(response.text)

	@staticmethod
	def generate_ticket(ticket_obj):
		"""
		Generate a Google ticket (pass) create the save to wallet URL and 
		return it along with the token.
		"""
		# Generate the ticket
		service_account_info = GoogleTicket.get_service_account_info()
		http_client = GoogleTicket.authenticate(
			service_account_info=service_account_info,
			scopes=["https://www.googleapis.com/auth/wallet_object.issuer"],
		)
		ticket_id = "%s.%s" % (
			GoogleTicket.get_issuer_id(), str(ticket_obj.public_id)
		)
		class_id = "%s.%s" % (
			GoogleTicket.get_issuer_id(), str(ticket_obj.event.public_id)
		)
		url = "https://walletobjects.googleapis.com/walletobjects/v1/eventTicketObject"
		payload = {
			"id": ticket_id,
			"classId": class_id,
			"state": "ACTIVE",
			"barcode": {
				"type": "QR_CODE",
				"value": str(ticket_obj.embed_code)
			}
		}
		response = http_client.post(url, json=payload)

		# Get the save to wallet URL
		object_id = json.loads(response.text).get("id")
		claims = {
			"iss": http_client.credentials.service_account_email,
			"aud": "google",
			"origins": ["socialpass.io"],
			"typ": "savetowallet",
			"payload": {"eventTicketObjects": [{"id": object_id}]},
		}
		signer = crypt.RSASigner.from_service_account_info(service_account_info)
		token = jwt.encode(signer, claims).decode("utf-8")
		save_url = "https://pay.google.com/gp/v/save/%s" % token

		return {
			"token": token,
			"save_url": save_url
		}
