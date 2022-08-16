# find the template and render it.
from io import BytesIO
import os

from django.conf import settings
from django.contrib.staticfiles import finders
from django.template.loader import get_template

from xhtml2pdf import pisa

from apps.root.models import Ticket


class PDFTicket:
    def __init__(self, template: str = 'ticket/pdf.html') -> None:
        self.template = get_template(template)

    def set_template(self, template: str):
        self.template = get_template(template)

    def generate_pdf(self, context: dict = {}):
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
        return self.generate_pdf({"ticket": ticket})

    def _link_callback(uri, rel):
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
