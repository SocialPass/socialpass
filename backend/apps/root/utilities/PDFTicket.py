# find the template and render it.
from io import BytesIO
import os
import base64

from django.conf import settings
from django.contrib.staticfiles import finders
from django.template.loader import get_template

from xhtml2pdf import pisa
import qrcode

from apps.root.models import Ticket


class PDFTicket:
    def __init__(self, template: str = 'ticket/pdf.html') -> None:
        self.template = get_template(template)

    def set_template(self, template: str):
        self.template = get_template(template)

    def generate_pdf(
        self,
        event_title: str,
        order_number: str,
        ticket_quantity: int,
        ticket_type: str,
        location_name: str,
        location_address: str,
        event_date: str,
        event_time: str,
        event_timezone: str,
        barcode_content: str,
        team_logo_url: str,
    ) -> BytesIO:
        """
        Generate a PDF from the supplied data
        """

        # Generate the qr code image
        barcode_image = self._generate_qr_code(barcode_content)

        # Set the template context from the supplied data
        context = {
            **locals(),
            "barcode_image": base64.b64encode(barcode_image.getvalue())
        }

        # Render the template with the context
        html = self.template.render(context)

        # create BytesIO object to store the PDF in memory
        pdfFile = BytesIO()

        # create a pdf
        pisa_status = pisa.CreatePDF(
            html, dest=pdfFile, link_callback=self._link_callback
        )

        # if error, raise an exception
        if pisa_status.err:
            raise pisa_status.err

        return pdfFile

    def generate_pdf_from_ticket(self, ticket: Ticket):
        """
        Generate a PDF from the ticket object
        """
        event = ticket.event
        team = ticket.event.team

        # Create the address from event data
        address = ""
        if event.address_1:
            address += event.address_1 + "\n"
        if event.address_2:
            address += event.address_2 + "\n"

        address_items_list = []
        if event.city:
            address_items_list.append(event.city)
        if event.region:
            address_items_list.append(event.region)
        if event.postal_code:
            address_items_list.append(event.postal_code)
        if event.country:
            address_items_list.append(event.country)

        context = {
            "event_title": event.title,
            "order_number": "54593405723",
            "ticket_quantity": 1,
            "ticket_type": "General Admission",
            "location_name": event.location,
            "location_address": ", ".join(address_items_list),
            "event_date": event.start_date.strftime("%A, %B %d, %Y"),
            "event_time": event.start_date.strftime("%I:%M %p"),
            "event_timezone": event.timezone,
            "barcode_content": ticket.embed_code,
            "team_logo_url": team.image.url
        }

        return self.generate_pdf(**context)

    def _generate_qr_code(self, content) -> BytesIO:
        """
        Generate qr code image (PNG) buffer from the supplied content.
        """

        qrcode_image = qrcode.make(content)

        image_buffer = BytesIO()
        qrcode_image.save(image_buffer, format="PNG")

        return image_buffer

    def _link_callback(self, uri, rel):
        """
        Convert HTML URIs to absolute system paths so xhtml2pdf can access those
        resources
        """
        result = finders.find(uri)
        if result:
            if not isinstance(result, (list, tuple)):
                result = [result]
            result = list(os.path.realpath(path) for path in result)
            path = result[0]
        else:
            sUrl = settings.STATIC_URL        # Typically /static/
            sRoot = settings.STATIC_ROOT      # Typically /home/userX/project_static/
            mUrl = settings.MEDIA_URL         # Typically /media/
            mRoot = settings.MEDIA_ROOT       # Typically /home/userX/project_static/media/

            if uri.startswith(mUrl):
                path = os.path.join(mRoot, uri.replace(mUrl, ""))
            elif uri.startswith(sUrl):
                path = os.path.join(sRoot, uri.replace(sUrl, ""))
            else:
                return uri

        # make sure that file exists
        if not os.path.isfile(path):
            raise Exception(
                'media URI must start with %s or %s' % (sUrl, mUrl)
            )
        return path
