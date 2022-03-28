# NFTY (IRL) Ticket Generator
# By NFTY Labs
import io
import random
import re
import qrcode
import urllib.request
import boto3
from PIL import Image, ImageDraw, ImageFont
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import CircleModuleDrawer

from config import settings

# config
s3 = boto3.client(
    "s3",
    region_name='nyc3',
    endpoint_url=settings.SERVICES_SPACES_URL,
    aws_access_key_id=settings.SERVICES_SPACES_KEY,
    aws_secret_access_key=settings.SERVICES_SPACES_SECRET
)

# S3 config
S3_BUCKET_NAME = settings.SERVICES_SPACES_BUCKET_NAME,
S3_DIR = settings.SERVICES_SPACES_DIRECTORY,


theme_list = [
    # Simple light themes
    {
        'bg_color': (249, 249, 249),
        'text_color': (0, 0, 0),
        'primary_color': (6, 82, 221),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (249, 249, 249),
        'text_color': (0, 0, 0),
        'primary_color': (237, 76, 103),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (249, 249, 249),
        'text_color': (0, 0, 0),
        'primary_color': (238, 90, 36),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (249, 249, 249),
        'text_color': (0, 0, 0),
        'primary_color': (56, 173, 169),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (249, 249, 249),
        'text_color': (0, 0, 0),
        'primary_color': (165, 94, 234),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (249, 249, 249),
        'text_color': (0, 0, 0),
        'primary_color': (179, 55, 113),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (249, 249, 249),
        'text_color': (0, 0, 0),
        'primary_color': (46, 204, 113),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (249, 249, 249),
        'text_color': (0, 0, 0),
        'primary_color': (243, 104, 224),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (249, 249, 249),
        'text_color': (0, 0, 0),
        'primary_color': (84, 109, 229),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (249, 249, 249),
        'text_color': (0, 0, 0),
        'primary_color': (52, 152, 219),
        'text_color_on_primary': (255, 255, 255)
    },
    # Simple dark themes
    {
        'bg_color': (29, 29, 29),
        'text_color': (255, 255, 255),
        'primary_color': (83, 82, 237),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (29, 29, 29),
        'text_color': (255, 255, 255),
        'primary_color': (237, 76, 103),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (29, 29, 29),
        'text_color': (255, 255, 255),
        'primary_color': (238, 90, 36),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (29, 29, 29),
        'text_color': (255, 255, 255),
        'primary_color': (56, 173, 169),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (29, 29, 29),
        'text_color': (255, 255, 255),
        'primary_color': (165, 94, 234),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (29, 29, 29),
        'text_color': (255, 255, 255),
        'primary_color': (179, 55, 113),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (29, 29, 29),
        'text_color': (255, 255, 255),
        'primary_color': (46, 204, 113),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (29, 29, 29),
        'text_color': (255, 255, 255),
        'primary_color': (243, 104, 224),
        'text_color_on_primary': (255, 255, 255)
    },
    {
        'bg_color': (29, 29, 29),
        'text_color': (255, 255, 255),
        'primary_color': (255, 195, 18),
        'text_color_on_primary': (29, 29, 29)
    },
    {
        'bg_color': (29, 29, 29),
        'text_color': (255, 255, 255),
        'primary_color': (52, 152, 219),
        'text_color_on_primary': (255, 255, 255)
    },
]


# Canvas settings

DEFAULT_SCALE = 2                               # Makes easy to resize
DEFAULT_WIDTH = 400 * DEFAULT_SCALE             # Width of the ticket
DEFAULT_MARGIN = 36 * DEFAULT_SCALE             # Spacing for content
WORKING_CANVAS_PADDING = 50 * DEFAULT_SCALE     # Padding around ticket


# Colors

BG_COLOR = (249, 249, 249)              # Background color of ticket
TITLE_TEXT_COLOR = (6, 82, 221)         # Color of text titles
CONTENT_TEXT_COLOR = (0, 0, 0)          # Color of text content
BANNER_COLOR = (6, 82, 221)             # Background color of banners
BANNER_TEXT_COLOR = (255, 255, 255)     # Color of text on banners
QR_CODE_FILL_COLOR = (0, 0, 0)          # Color of boxes on QR code
QR_CODE_BG_COLOR = (255, 255, 255)      # Background color of the QR code
WORKING_CANVAS_COLOR = (255, 255, 255)  # Should be different from background!

def set_theme(new_theme):
    """
    Given a new theme, the old is updated.
    """
    global BG_COLOR, TITLE_TEXT_COLOR, CONTENT_TEXT_COLOR
    global BANNER_COLOR, BANNER_TEXT_COLOR
    global QR_CODE_FILL_COLOR, QR_CODE_BG_COLOR
    global WORKING_CANVAS_COLOR

    BG_COLOR = new_theme['bg_color']
    TITLE_TEXT_COLOR = new_theme['primary_color']
    CONTENT_TEXT_COLOR = new_theme['text_color']
    BANNER_COLOR = new_theme['primary_color']
    BANNER_TEXT_COLOR = new_theme['text_color_on_primary']

    if 'qr_code_fill_color' in new_theme:
        QR_CODE_FILL_COLOR = new_theme['qr_code_fill_color']

    if 'qr_code_bg_color' in new_theme:
        QR_CODE_BG_COLOR = new_theme['qr_code_bg_color']

    if 'working_canvas_color' in new_theme:
        WORKING_CANVAS_COLOR = new_theme['working_canvas_color']


# Fonts (and related)

BASE_FONT_TYPE = 'static/fonts/RobotoMono-Bold.ttf'     # Default font

def get_base_pil_font(size):
    return ImageFont.truetype(BASE_FONT_TYPE, size)

TITLE_FONT = get_base_pil_font(12 * DEFAULT_SCALE)      # Font for text titles
CONTENT_FONT = get_base_pil_font(14 * DEFAULT_SCALE)    # Font for text content
BANNER_FONT = get_base_pil_font(30 * DEFAULT_SCALE)     # Font for banners
FOOTER_FONT = get_base_pil_font(8 * DEFAULT_SCALE)      # Font for footer text


# Other settings

TOP_NOTCH_RADIUS = 50 * DEFAULT_SCALE
TOP_BANNER_HEIGHT = 70 * DEFAULT_SCALE
BOTTOM_BANNER_HEIGHT = 4 * DEFAULT_SCALE
QR_CODE_BOX_SIZE = 4 * DEFAULT_SCALE
QR_CODE_BORDER = 1 * DEFAULT_SCALE
QR_CODE_CONTAINER_EXTRA = 10 * DEFAULT_SCALE
QR_CODE_CONTAINER_RADIUS = 10 * DEFAULT_SCALE


# Spacing settings (for ticket content)

TEXT_CONTENT_V_SPACING = 10 * DEFAULT_SCALE
EVENT_GATE_LIMIT_WIDTH = int(DEFAULT_WIDTH * (2/5))
EVENT_DATE_WIDTH = int(DEFAULT_WIDTH * (3/5))
THEME_NAME_WIDTH = int(DEFAULT_WIDTH * (1/4))
THEME_RARITY_WIDTH = int(DEFAULT_WIDTH * (1/4))

SPACE_BEFORE_TOP_BANNER = 80 * DEFAULT_SCALE
SPACE_AFTER_TOP_BANNER = 30 * DEFAULT_SCALE
SPACE_AFTER_EVENT_DATA_ITEMS = 15 * DEFAULT_SCALE
SPACE_AFTER_EVENT_DATA = 60 * DEFAULT_SCALE
SPACE_AFTER_QR_CODE_SCENE_IMAGE = 30 * DEFAULT_SCALE
SPACE_AFTER_BOTTOM_BANNER = 15 * DEFAULT_SCALE
SPACE_AFTER_THEME_DATA = 15 * DEFAULT_SCALE


# From https://stackoverflow.com/a/58176967/5056347

def break_fix(text, width, font, draw):
    """
    Fix line breaks in text.
    """
    if not text:
        return
    if isinstance(text, str):
        text = text.split()

    lo = 0
    hi = len(text)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        t = ' '.join(text[:mid])
        w, h = draw.textsize(t, font=font)
        if w <= width:
            lo = mid
        else:
            hi = mid - 1
    t = ' '.join(text[:lo])
    w, h = draw.textsize(t, font=font)
    yield t, w, h
    yield from break_fix(text[lo:], width, font, draw)


# Edited from https://stackoverflow.com/a/58176967/5056347

def fit_text(
    img, text, color, font, x_start_offset=0, x_end_offset=0, center=False):
    """
    Fit text into container after applying line breaks. Returns the total
    height taken up by the text, which can be used to create containers of
    dynamic heights.
    """
    width = img.size[0] - x_start_offset - x_end_offset
    draw = ImageDraw.Draw(img)
    pieces = list(break_fix(text, width, font, draw))
    height = sum(p[2] for p in pieces)
    y = (img.size[1] - height) // 2
    h_taken_by_text = 0
    for t, w, h in pieces:
        if center:
            x = (img.size[0] - w) // 2
        else:
            x = x_start_offset
        draw.text((x, y), t, font=font, fill=color)
        new_width, new_height = draw.textsize(t, font=font)
        y += h
        h_taken_by_text += new_height
    return h_taken_by_text


def make_white_transparent(img):
    """
    Turn a white canvas into a transparent one.
    """
    img = img.convert('RGBA')
    imgData = img.getdata()

    newData = []
    for item in imgData:
        if item[0] == 255 and item[1] == 255 and item[2] == 255:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    return img


def concat_h(img1, img2, offset=0):
    """
    Join two images horizontally (while maintaining transparency).
    """
    img = Image.new(
        'RGB',
        (img1.width + img2.width + offset, max(img1.height, img2.height)),
        color = 'white'
    )
    img = make_white_transparent(img)
    img.paste(img1, (0, 0))
    img.paste(img2, (img1.width + offset, 0))
    return img


def concat_v(img1, img2, offset=0):
    """
    Join two images vertically (while maintaining transparency).
    """
    img = Image.new(
        'RGB',
        (max(img1.width, img2.width), img1.height + img2.height + offset),
        color = 'white'
    )
    img = make_white_transparent(img)
    img.paste(img1, (0, 0))
    img.paste(img2, (0, img1.height + offset))
    return img


def overlay_center(img, bg):
    """
    Overlay image on background (by centering it).
    """
    img_w, img_h = img.size
    bg_w, bg_h = bg.size
    offset = ((bg_w - img_w) // 2, (bg_h - img_h) // 2)
    bg.paste(img, offset)
    return bg


def get_image_from_source(source):
    """
    Given a source, return the image as a usable PIL object. Sources can be
    one of the following:
        - Filepath (saves time to embed if available locally)
        - URL (image is downloaded before embedding)
    """
    url_regex = re.compile(
        r'^(?:http|ftp)s?://' # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' # Domain
        r'localhost|' # Localhost
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # IP address
        r'(?::\d+)?' # Optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE
    )

    # If URL is provided, the image is downloaded from the URL
    if (re.match(url_regex, source) is not None):
        source = io.BytesIO(urllib.request.urlopen(source).read())

    return Image.open(source).convert('RGBA')


class TicketPartGenerator:
    """
    This class is an easy way to compile methods that generate various parts
    of the ticket.
    """
    @staticmethod
    def generate_banner(width, height, bg_color, color, font, text=None):
        """
        Generates an image for a banner section. Also fixes a weird bug for
        vertically centering text in PIL (with custom font) that is more
        noticeable on banners.
        """
        img = Image.new('RGB', (width, height), color=bg_color)

        # Fit text (if any)
        if text:
            draw = ImageDraw.Draw(img)
            width_text, height_text = draw.textsize(text, font)

            offset_x, offset_y = font.getoffset(text)
            width_text += offset_x
            height_text += offset_y

            top_left_x = width / 2 - width_text / 2
            top_left_y = height / 2 - height_text / 2
            xy = top_left_x, top_left_y

            draw.text(xy, text.upper(), font=font, fill=color)

        return img

    @staticmethod
    def generate_text_section(
        width, text, color, font, x_start_offset, x_end_offset, v_spacing):
        """
        Generates an image for a text section.
        """
        # Calculate height using "fake" canvas
        img = Image.new('RGB', (width, 1), color='white')
        calc_height = fit_text(
            img, text.upper(), color, font, x_start_offset, x_end_offset, False
        )

        # Create real canvas and fit text
        img = Image.new('RGB', (width, calc_height + v_spacing), color='white')
        img = make_white_transparent(img)
        fit_text(
            img, text.upper(), color, font, x_start_offset, x_end_offset, False
        )

        return img

    @staticmethod
    def generate_qr_code(embed):
        """
        Generates an image for the QR code inside a container.
        """
        # Generate the QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=QR_CODE_BOX_SIZE,
            border=QR_CODE_BORDER,
        )
        qr.add_data(embed)
        qr.make(fit=True)
        qr_img = qr.make_image(
            fill_color=QR_CODE_FILL_COLOR, back_color=QR_CODE_BG_COLOR,
            image_factory=StyledPilImage, module_drawer=CircleModuleDrawer()
        )

        # Create rounded container for the QR code
        # Scaling down creates anti-aliasing
        # Width of QR image is smaller for some reason (possible bug?)
        scale = 2
        container_width = (qr_img.height + QR_CODE_CONTAINER_EXTRA) * scale
        container_height = container_width
        container_radius = QR_CODE_CONTAINER_RADIUS * scale

        container = Image.new(
            'RGB', (container_width, container_height), color='white'
        )
        container = make_white_transparent(container)
        draw = ImageDraw.Draw(container)
        draw.rounded_rectangle(
            (0, 0, container_width, container_height),
            fill=QR_CODE_BG_COLOR,
            radius=container_radius
        )
        container = container.resize(
            (container_width // scale, container_height // scale),
            resample=Image.ANTIALIAS
        )

        # Add QR code on to the container
        qr_img = overlay_center(qr_img, container)

        return qr_img

    @staticmethod
    def generate_scene_image(source, max_height):
        """
        Generates scene image from source and resizes it while maintaining
        aspect ratio.
        """
        scene_img = get_image_from_source(source)

        # Resize image to max height (while maintaining aspect ratio)
        hpercent = (max_height / float(scene_img.size[1]))
        wsize = int((float(scene_img.size[0]) * float(hpercent)))
        scene_img = scene_img.resize(
            (wsize, max_height), Image.ANTIALIAS
        )

        return scene_img

    @staticmethod
    def get_scene_image_w_area(qr_img):
        """
        Given a QR code image, the working area (width) available to the scene
        image is calculated:

            | m |   QR code   | m |     Scene image working area     | m |

            Where m = margin
        """
        return int(DEFAULT_WIDTH - qr_img.width - (3 * DEFAULT_MARGIN))

    @staticmethod
    def join_qr_code_scene_image(qr_img, v_spacing, scene_img=None):
        """
        Given a QR code image and scene image, they are placed next to one
        another. If scene image is not provided, QR code is centered.
        """
        # Create canvas
        img = Image.new(
            'RGB', (DEFAULT_WIDTH, qr_img.height + v_spacing), color='white'
        )
        img = make_white_transparent(img)

        if scene_img:
            # Add QR code
            img.paste(qr_img, (DEFAULT_MARGIN, v_spacing), qr_img)

            # Add scene image
            scene_img_w_area = TicketPartGenerator.get_scene_image_w_area(
                qr_img
            )
            scene_img_x_offset = int(
                (2 * DEFAULT_MARGIN) + qr_img.width +
                (scene_img_w_area - scene_img.width)
            )
            if scene_img_x_offset < 0:
                scene_img_x_offset = 0
            img.paste(
                scene_img,
                (scene_img_x_offset, v_spacing),
                scene_img
            )
        else:
            # Overlay QR code (centered)
            img = overlay_center(qr_img, img)

        return img


def generate_ticket(
    event_data, embed, theme=None, top_banner_text='SocialPass Ticket',
    scene_img_source=None):
    """
    Generates the actual image for the ticket.

    Note:
        - This method should NOT be pre-maturely optimized or abstracted. It
        is better to keep everything readable and easy to understand before
        the ticket designs are fully finalized.
    """
    # Set theme data (for now, just random is supported)
    theme_data = {
        'name': 'Random',
        'rarity': 'N/A'
    }

    # Select which theme to set (randomize if one is not provided)
    if isinstance(theme, dict):
        theme_to_set = theme
    else:
        theme_to_set = random.choice(theme_list)

    set_theme(theme_to_set)

    # Dictionary to hold all the ticket parts before assembly
    ticket_parts = {}

    # Top banner
    ticket_parts['top_banner'] = make_white_transparent(
        Image.new(
            'RGB', (DEFAULT_WIDTH, SPACE_BEFORE_TOP_BANNER), color='white'
        )
    )
    top_banner_img = TicketPartGenerator.generate_banner(
        width=DEFAULT_WIDTH,
        height=TOP_BANNER_HEIGHT,
        bg_color=BANNER_COLOR,
        color=BANNER_TEXT_COLOR,
        font=BANNER_FONT,
        text=top_banner_text
    )
    ticket_parts['top_banner'] = concat_v(
        ticket_parts['top_banner'], top_banner_img
    )

    # Event name
    ticket_parts['event_name'] = concat_v(
        TicketPartGenerator.generate_text_section(
            width=DEFAULT_WIDTH,
            text='Event',
            color=TITLE_TEXT_COLOR,
            font=TITLE_FONT,
            x_start_offset=DEFAULT_MARGIN,
            x_end_offset=DEFAULT_MARGIN,
            v_spacing=0
        ),
        TicketPartGenerator.generate_text_section(
            width=DEFAULT_WIDTH,
            text=event_data['name'],
            color=CONTENT_TEXT_COLOR,
            font=CONTENT_FONT,
            x_start_offset=DEFAULT_MARGIN,
            x_end_offset=DEFAULT_MARGIN,
            v_spacing=TEXT_CONTENT_V_SPACING
        ),
    )

    # Event gate limit
    if 'gate_limit' in event_data:
        ticket_parts['event_gate_limit'] = concat_v(
            TicketPartGenerator.generate_text_section(
                width=EVENT_GATE_LIMIT_WIDTH,
                text='Gate Limit',
                color=TITLE_TEXT_COLOR,
                font=TITLE_FONT,
                x_start_offset=DEFAULT_MARGIN,
                x_end_offset=DEFAULT_MARGIN,
                v_spacing=0
            ),
            TicketPartGenerator.generate_text_section(
                width=EVENT_GATE_LIMIT_WIDTH,
                text=event_data['gate_limit'],
                color=CONTENT_TEXT_COLOR,
                font=CONTENT_FONT,
                x_start_offset=DEFAULT_MARGIN,
                x_end_offset=DEFAULT_MARGIN,
                v_spacing=TEXT_CONTENT_V_SPACING
            ),
        )
    else:
        global EVENT_DATE_WIDTH
        EVENT_DATE_WIDTH = DEFAULT_WIDTH

    # Event date
    ticket_parts['event_date'] = concat_v(
        TicketPartGenerator.generate_text_section(
            width=EVENT_DATE_WIDTH,
            text='Date',
            color=TITLE_TEXT_COLOR,
            font=TITLE_FONT,
            x_start_offset=DEFAULT_MARGIN,
            x_end_offset=DEFAULT_MARGIN,
            v_spacing=0
        ),
        TicketPartGenerator.generate_text_section(
            width=EVENT_DATE_WIDTH,
            text=event_data['date'],
            color=CONTENT_TEXT_COLOR,
            font=CONTENT_FONT,
            x_start_offset=DEFAULT_MARGIN,
            x_end_offset=DEFAULT_MARGIN,
            v_spacing=TEXT_CONTENT_V_SPACING
        ),
    )

    # Event location
    ticket_parts['event_location'] = concat_v(
        TicketPartGenerator.generate_text_section(
            width=DEFAULT_WIDTH,
            text='Location',
            color=TITLE_TEXT_COLOR,
            font=TITLE_FONT,
            x_start_offset=DEFAULT_MARGIN,
            x_end_offset=DEFAULT_MARGIN,
            v_spacing=0
        ),
        TicketPartGenerator.generate_text_section(
            width=DEFAULT_WIDTH,
            text=event_data['location'],
            color=CONTENT_TEXT_COLOR,
            font=CONTENT_FONT,
            x_start_offset=DEFAULT_MARGIN,
            x_end_offset=DEFAULT_MARGIN,
            v_spacing=TEXT_CONTENT_V_SPACING
        ),
    )

    # QR code
    ticket_parts['qr_code'] = TicketPartGenerator.generate_qr_code(embed)

    # Scene image
    if scene_img_source:
        # Ticket still gets generated if the scene image source doesn't work
        try:
            scene_img = TicketPartGenerator.generate_scene_image(
                scene_img_source, ticket_parts['qr_code'].height
            )
        except Exception as e:
            print('Error getting scene image.')
            scene_img = None
        ticket_parts['scene_img'] = scene_img
    else:
        ticket_parts['scene_img'] = None

    # Bottom banner
    ticket_parts['bottom_banner'] = TicketPartGenerator.generate_banner(
        width=DEFAULT_WIDTH,
        height=BOTTOM_BANNER_HEIGHT,
        bg_color=BANNER_COLOR,
        color=BANNER_TEXT_COLOR,
        font=BANNER_FONT,
        text=None
    )

    # Theme name
    ticket_parts['theme_name'] = concat_v(
        TicketPartGenerator.generate_text_section(
            width=THEME_NAME_WIDTH,
            text='Theme',
            color=TITLE_TEXT_COLOR,
            font=FOOTER_FONT,
            x_start_offset=DEFAULT_MARGIN,
            x_end_offset=0,
            v_spacing=0
        ),
        TicketPartGenerator.generate_text_section(
            width=THEME_NAME_WIDTH,
            text=theme_data['name'],
            color=CONTENT_TEXT_COLOR,
            font=FOOTER_FONT,
            x_start_offset=DEFAULT_MARGIN,
            x_end_offset=0,
            v_spacing=TEXT_CONTENT_V_SPACING
        ),
    )

    # Theme rarity
    ticket_parts['theme_rarity'] = concat_v(
        TicketPartGenerator.generate_text_section(
            width=THEME_RARITY_WIDTH,
            text='Rarity',
            color=TITLE_TEXT_COLOR,
            font=FOOTER_FONT,
            x_start_offset=int(DEFAULT_MARGIN / 2),
            x_end_offset=DEFAULT_MARGIN,
            v_spacing=0
        ),
        TicketPartGenerator.generate_text_section(
            width=THEME_RARITY_WIDTH,
            text=theme_data['rarity'],
            color=CONTENT_TEXT_COLOR,
            font=FOOTER_FONT,
            x_start_offset=int(DEFAULT_MARGIN / 2),
            x_end_offset=DEFAULT_MARGIN,
            v_spacing=TEXT_CONTENT_V_SPACING
        ),
    )

    # Putting everything together into one image

    # Top banner and event name
    ticket_img = concat_v(
        ticket_parts['top_banner'], ticket_parts['event_name'],
        SPACE_AFTER_TOP_BANNER
    )

    # Gate limit and event date
    if 'gate_limit' in event_data:
        event_gate_limit_date_img = concat_h(
            ticket_parts['event_gate_limit'], ticket_parts['event_date']
        )
        ticket_img = concat_v(
            ticket_img, event_gate_limit_date_img, SPACE_AFTER_EVENT_DATA_ITEMS
        )
    else:
        ticket_img = concat_v(
            ticket_img, ticket_parts['event_date'],
            SPACE_AFTER_EVENT_DATA_ITEMS
        )

    # Event location
    ticket_img = concat_v(
        ticket_img, ticket_parts['event_location'],
        SPACE_AFTER_EVENT_DATA_ITEMS
    )

    # QR code and scene image
    qr_code_scene_img = TicketPartGenerator.join_qr_code_scene_image(
        ticket_parts['qr_code'], 0, ticket_parts['scene_img']
    )
    ticket_img = concat_v(
        ticket_img, qr_code_scene_img, SPACE_AFTER_EVENT_DATA
    )

    # Bottom banner
    ticket_img = concat_v(
        ticket_img, ticket_parts['bottom_banner'],
        SPACE_AFTER_QR_CODE_SCENE_IMAGE
    )

    # Footer
    theme_text_sections_img = concat_h(
        ticket_parts['theme_name'], ticket_parts['theme_rarity']
    )
    theme_section_img = make_white_transparent(
        Image.new(
            'RGB', (DEFAULT_WIDTH - theme_text_sections_img.width, 1),
            color='white'
        )
    )
    theme_section_img = concat_h(
        theme_section_img, theme_text_sections_img
    )
    ticket_img = concat_v(
        ticket_img, theme_section_img, SPACE_AFTER_BOTTOM_BANNER
    )
    footer_img = make_white_transparent(
        Image.new(
            'RGB', (DEFAULT_WIDTH, SPACE_AFTER_THEME_DATA), color='white'
        )
    )
    ticket_img = concat_v(ticket_img, footer_img)

    # Create the background image and notch
    # Scaling down creates anti-aliasing
    scale = 2
    bg_width = ticket_img.width * scale
    bg_height = ticket_img.height * scale
    notch_radius = TOP_NOTCH_RADIUS * scale

    ticket_with_bg = Image.new('RGB', (bg_width, bg_height), color=BG_COLOR)
    draw = ImageDraw.Draw(ticket_with_bg)
    x0 = (bg_width - (notch_radius * 2)) // 2
    x1 = x0 + (notch_radius * 2)
    y0 = -notch_radius
    y1 = notch_radius
    draw.ellipse((x0, y0, x1, y1), fill=WORKING_CANVAS_COLOR)
    ticket_with_bg = ticket_with_bg.resize(
        (bg_width // scale, bg_height // scale),
        resample=Image.ANTIALIAS
    )
    ticket_with_bg.paste(ticket_img, (0, 0), ticket_img)

    # Create the full canvas and result
    full_canvas = Image.new(
        'RGB',
        (
            ticket_img.width + WORKING_CANVAS_PADDING,
            ticket_img.height + WORKING_CANVAS_PADDING
        ),
        color=WORKING_CANVAS_COLOR
    )
    result = overlay_center(ticket_with_bg, full_canvas)

    return result


def store_ticket(ticket_img, filename):
    ticket_img.show()
    # Prepare image for S3
    buffer = io.BytesIO()
    ticket_img.save(buffer, "PNG")
    buffer.seek(0)  # Rewind pointer back to start

    """
    # put image into s3
    response = s3.put_object(
        Bucket=S3_BUCKET_NAME,
        Key=f"{S3_DIR}{filename}.png",
        Body=buffer,
        ContentType="image/png",
    )
    """

    return buffer
