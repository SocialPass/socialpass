# find the template and render it.
import base64
import os
from io import BytesIO

import qrcode
from django.conf import settings
from django.contrib.staticfiles import finders
from django.template.loader import get_template
from xhtml2pdf import pisa

from apps.root.models import Ticket


class PDFTicket:
    def __init__(self, template: str = "ticket/pdf.html") -> None:
        self.template = get_template(template)

    def set_template(self, template_path: str):
        """
        Set the PDF template
        """
        self.template = get_template(template_path)

    def generate_pdf(self, context: dict = dict, barcode_content: str = "") -> BytesIO:
        """
        Generate a PDF from the supplied data.

        Barcode will be generated from the barcode_content if supplied,
        otherwise it won't be displayed.

        Context param is a dict responsible to define the data. If using the default
        template it must contain the following keys:

        Args:
            :param dict context: dict of data to be used in the template
            :param str barcode_content: content to be used to generate the barcode

        Context dict default keys:
            :key str event_title,
            :key str order_number,
            :key int ticket_quantity,
            :key str ticket_type,
            :key str location_name,
            :key str location_address,
            :key str event_date,
            :key str event_time,
            :key str event_timezone,
            :key str team_logo_url,

        :return: BytesIO: A PDF file buffer

        """

        # Generate the qr code image
        if barcode_content and barcode_content != "":
            qr_code_image = self._generate_qr_code(barcode_content)
            context["barcode_image"] = base64.b64encode(qr_code_image.getvalue())

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

        event_date = event.start_date.strftime("%B %d, %Y") if event.start_date else ""
        event_time = event.start_date.strftime("%I:%M %p") if event.start_date else ""

        context = {
            "event_title": event.title,
            "order_number": "54593405723",
            "ticket_quantity": 1,
            "ticket_type": "General Admission",
            "location_name": event.location,
            "location_address": ", ".join(address_items_list),
            "event_date": event_date,
            "event_time": event_time,
            "event_timezone": event.timezone,
            "team_logo_url": team.image.url,
        }

        return self.generate_pdf(context, barcode_content=str(ticket.embed_code))

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
            sUrl = settings.STATIC_URL  # Typically /static/
            sRoot = settings.STATIC_ROOT  # Typically /home/userX/project_static/
            mUrl = settings.MEDIA_URL  # Typically /media/
            mRoot = settings.MEDIA_ROOT  # Typically /home/userX/project_static/media/

            if uri.startswith(mUrl):
                path = os.path.join(mRoot, uri.replace(mUrl, ""))
            elif uri.startswith(sUrl):
                path = os.path.join(sRoot, uri.replace(sUrl, ""))
            else:
                return uri

        # make sure that file exists
        if not os.path.isfile(path):
            raise Exception("media URI must start with %s or %s" % (sUrl, mUrl))
        return path
