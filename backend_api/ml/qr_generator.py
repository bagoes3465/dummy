"""QR Code Generator for download links."""
import io
import qrcode
from PIL import Image


def generate_qr_code(data: str) -> bytes:
    """Generate a QR code PNG image from data string. Returns bytes."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
