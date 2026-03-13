"""
AI Photobooth - Background Removal & Compositing Pipeline
Integrates with machine_learning/AI_Model logic
"""
import io
import base64
import time
import requests
import numpy as np
import cv2
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
from config import settings

# ── Configuration ──────────────────────────────────────────
PERSON_HEIGHT_RATIO = 0.75
VERTICAL_POSITION = 0.50
SHADOW_INTENSITY = 0.12
SHADOW_BLUR = 21  # Must be odd
MASCOT_HEIGHT_RATIO = 0.25
MASCOT_POSITION_X = 0.75  # Right side
MASCOT_POSITION_Y = 0.70  # Lower area

_session = requests.Session()
_session.headers.update({"User-Agent": "PhotoBooth/2.0"})


# ── Background Removal ────────────────────────────────────

def remove_background(image: Image.Image) -> Image.Image:
    """Remove background with GPU → CPU → simple fallback."""
    try:
        from rembg import remove
        result = remove(image)
        return _smooth_edges(result)
    except Exception:
        try:
            import os
            os.environ["ONNXRUNTIME_EXECUTION_PROVIDERS"] = "CPUExecutionProvider"
            from rembg import remove
            result = remove(image)
            return _smooth_edges(result)
        except Exception:
            return _smooth_edges(_simple_bg_removal(image))


def _simple_bg_removal(image: Image.Image) -> Image.Image:
    """Fallback: HSV-based background removal."""
    if image.mode != "RGBA":
        image = image.convert("RGBA")

    img_array = np.array(image.convert("RGB"))
    hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)

    lower_white = np.array([0, 0, 200])
    upper_white = np.array([180, 50, 255])
    mask = cv2.inRange(hsv, lower_white, upper_white)
    mask = cv2.bitwise_not(mask)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask = cv2.GaussianBlur(mask, (5, 5), 0)

    img_array = np.array(image)
    img_array[:, :, 3] = mask
    return Image.fromarray(img_array, "RGBA")


def _smooth_edges(image: Image.Image) -> Image.Image:
    """Gaussian blur on alpha channel for soft edges."""
    if image.mode != "RGBA":
        return image
    img_array = np.array(image)
    alpha = img_array[:, :, 3]
    alpha = cv2.GaussianBlur(alpha, (5, 5), 0)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 1)
    img_array[:, :, 3] = alpha.astype(np.uint8)
    return Image.fromarray(img_array, "RGBA")


# ── Lighting Adjustment ───────────────────────────────────

def _adjust_lighting(person_img: Image.Image, bg_img: Image.Image) -> Image.Image:
    """Match person lighting/color to background."""
    bg_brightness = np.mean(np.array(bg_img.convert("RGB"))[:, :, :3])
    person_brightness = np.mean(np.array(person_img.convert("RGB"))[:, :, :3])

    ratio = bg_brightness / (person_brightness + 1)
    factor = max(0.75, min(1.0, 1.0 + (ratio - 1.0) * 0.75))

    enhanced = ImageEnhance.Brightness(person_img).enhance(factor)
    enhanced = ImageEnhance.Contrast(enhanced).enhance(1.0)
    enhanced = enhanced.filter(ImageFilter.UnsharpMask(radius=1, percent=50, threshold=3))
    return enhanced


# ── Compositing ───────────────────────────────────────────

def _create_feather_mask(width: int, height: int) -> Image.Image:
    mask = np.full((height, width), 255, dtype=np.float32)
    y, x = np.ogrid[:height, :width]
    cy, cx = height // 2, width // 2
    distance = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
    max_dist = np.sqrt(cx ** 2 + cy ** 2)
    falloff = 1 - (distance / max_dist) * 0.15
    return Image.fromarray(np.clip(falloff * 255, 0, 255).astype(np.uint8), "L")


def _add_shadow(composite: Image.Image, pw: int, ph: int, x: int, y: int) -> Image.Image:
    """Add subtle natural shadow below person."""
    if composite.mode != "RGBA":
        composite = composite.convert("RGBA")

    shadow = np.zeros((*composite.size[::-1], 4), dtype=np.uint8)
    sh = int(ph * 0.1)
    sy_start = y + ph + 5

    if sy_start < composite.height:
        sy_end = min(sy_start + sh, composite.height)
        for row in range(sy_start, sy_end):
            progress = (row - sy_start) / (sy_end - sy_start)
            alpha = int(SHADOW_INTENSITY * 255 * (1 - progress))
            x_start, x_end = max(0, x), min(composite.width, x + pw)
            shadow[row, x_start:x_end, :3] = 100
            shadow[row, x_start:x_end, 3] = alpha

    shadow[:, :, 3] = cv2.GaussianBlur(shadow[:, :, 3], (SHADOW_BLUR, SHADOW_BLUR), 0)
    shadow_img = Image.fromarray(shadow, "RGBA")
    return Image.alpha_composite(composite, shadow_img)


def _composite(person: Image.Image, bg: Image.Image, mascot: Image.Image | None = None) -> Image.Image:
    """Composite person onto background with mascot."""
    bg = bg.convert("RGB")
    bg_w, bg_h = bg.size
    pw, ph = person.size

    # Resize person
    max_h = int(bg_h * PERSON_HEIGHT_RATIO)
    ratio = max_h / ph
    new_w, new_h = int(pw * ratio), max_h
    person = person.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Position person center
    x = (bg_w - new_w) // 2
    y = int(bg_h * VERTICAL_POSITION) - (new_h // 3)

    # Feather mask
    feather = _create_feather_mask(new_w, new_h)
    if person.mode == "RGBA":
        alpha = person.split()[3]
        alpha = Image.composite(alpha, Image.new("L", (new_w, new_h), 0), feather)
        person.putalpha(alpha)

    result = bg.copy().convert("RGBA")
    result.paste(person, (x, y), person)
    result = _add_shadow(result, new_w, new_h, x, y)

    # Add mascot
    if mascot is not None:
        mascot = mascot.convert("RGBA")
        mascot_max_h = int(bg_h * MASCOT_HEIGHT_RATIO)
        m_ratio = mascot_max_h / mascot.height
        mascot = mascot.resize(
            (int(mascot.width * m_ratio), mascot_max_h),
            Image.Resampling.LANCZOS,
        )
        mx = int(bg_w * MASCOT_POSITION_X) - mascot.width // 2
        my = int(bg_h * MASCOT_POSITION_Y)
        result.paste(mascot, (mx, my), mascot)

    return result


# ── AI Enhancement ────────────────────────────────────────

def _enhance_with_ai(composite: Image.Image, prompt_suffix: str = "") -> Image.Image | None:
    """Send to Nano-Banana API for AI enhancement."""
    api_key = settings.nano_banana_api_key
    base_url = settings.nano_banana_base_url

    if not api_key:
        return None

    # Convert to base64
    buf = io.BytesIO()
    composite.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    prompt = (
        "Perfect composite image: seamlessly blend person with background, "
        "match lighting, remove artifacts, enhance shadows, "
        "natural skin tone, depth consistency."
    )
    if prompt_suffix:
        prompt += f" Style: {prompt_suffix}"

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "aspect_ratio": "1:1",
        "image": f"data:image/png;base64,{b64}",
        "model": "google/nano-banana/edit",
        "prompt": prompt,
        "resolution": "1K",
    }

    try:
        resp = _session.post(f"{base_url}/v1/image/submit", headers=headers, json=payload, timeout=30)
        if resp.status_code != 200:
            return None
        data = resp.json()
        if data.get("code") != 200:
            return None

        request_id = data["resp_data"]["request_id"]

        # Poll for result
        for _ in range(30):
            time.sleep(3)
            check = _session.get(f"{base_url}/v1/image/{request_id}/result", headers=headers, timeout=30)
            check_data = check.json()
            if check_data.get("code") != 200:
                return None
            status = check_data["resp_data"]["status"]
            if status == "success":
                img_url = check_data["resp_data"]["image_list"][0]
                img_resp = _session.get(img_url, timeout=30)
                return Image.open(io.BytesIO(img_resp.content))
            elif status in ("error", "failed"):
                return None

    except Exception:
        return None

    return None


# ── Main Pipeline ─────────────────────────────────────────

def process_photobooth(
    person_img: Image.Image,
    bg_img: Image.Image,
    mascot_img: Image.Image | None = None,
    filter_config: dict | None = None,
) -> Image.Image:
    """
    Full photobooth processing pipeline:
    1. Background removal
    2. Edge smoothing
    3. Lighting adjustment
    4. Feather mask compositing + shadow + mascot
    5. AI enhancement (optional)
    """
    # Step 1-2: Remove background + smooth edges
    person_no_bg = remove_background(person_img)

    # Step 3: Lighting adjustment
    person_no_bg = _adjust_lighting(person_no_bg, bg_img)

    # Step 4: Composite
    composite = _composite(person_no_bg, bg_img, mascot_img)

    # Step 5: AI Enhancement
    prompt_suffix = ""
    if filter_config and isinstance(filter_config, dict):
        prompt_suffix = filter_config.get("prompt_suffix", "")

    enhanced = _enhance_with_ai(composite, prompt_suffix)
    if enhanced is not None:
        return enhanced

    # Fallback: return composite without AI enhancement
    if composite.mode == "RGBA":
        composite = composite.convert("RGB")
    return composite
