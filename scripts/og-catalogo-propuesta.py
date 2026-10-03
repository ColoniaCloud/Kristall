"""
Genera public/catalogo-propuesta/og.jpg — la vista previa del link de
/catalogo-propuesta cuando se comparte por DM (Instagram, WhatsApp, Facebook).

Estático y en JPG a propósito: un opengraph-image.tsx sale en PNG de ~1.5 MB, y
WhatsApp descarta las vistas previas pesadas. Este queda en ~100 KB.

Uso (desde kristall-web/):  python scripts/og-catalogo-propuesta.py
Requiere: pip install pillow fonttools brotli
"""

import io
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
FOTO = RAIZ / "public/Productos/destacadas/keramx.png"
FUENTE = RAIZ / "public/fonts/ClashDisplay-Variable.woff2"
SALIDA = RAIZ / "public/catalogo-propuesta/og.jpg"

W, H = 1200, 630
ROJO, ORO, NEGRO = (204, 0, 0), (230, 168, 0), (26, 26, 26)


def clash(tamano: int, peso: int) -> ImageFont.FreeTypeFont:
    # Pillow no lee woff2: se pasa a TTF en memoria y se fija el eje de peso.
    ttf = TTFont(str(FUENTE))
    ttf.flavor = None
    buf = io.BytesIO()
    ttf.save(buf)
    buf.seek(0)
    fuente = ImageFont.truetype(buf, tamano)
    fuente.set_variation_by_axes([peso])
    return fuente


def main() -> None:
    foto = Image.open(FOTO).convert("RGB")
    escala = W / foto.width
    foto = foto.resize((W, round(foto.height * escala)), Image.LANCZOS)
    arriba = (foto.height - H) // 2
    lienzo = foto.crop((0, arriba, W, arriba + H))

    # Degradado negro de izquierda a derecha para que el texto se lea.
    velo = Image.new("L", (W, 1))
    for x in range(W):
        t = x / W
        velo.putpixel((x, 0), round(255 * (0.96 - 0.9 * max(0.0, t - 0.25) / 0.75)))
    velo = velo.resize((W, H))
    lienzo = Image.composite(Image.new("RGB", (W, H), (10, 10, 10)), lienzo, velo)

    d = ImageDraw.Draw(lienzo)
    x = 72

    # Bandera + eyebrow.
    for i, color in enumerate((NEGRO, ROJO, ORO)):
        d.rectangle([x + i * 16, 112, x + i * 16 + 15, 135], fill=color)
    d.rectangle([x, 112, x + 47, 135], outline=(70, 70, 70))
    d.text((x + 64, 108), "LANZAMIENTO · LÍNEA AUTOMOTRIZ", font=clash(26, 500), fill=ORO)

    titulo = clash(86, 600)
    d.text((x, 168), "8 láminas.", font=titulo, fill=(255, 255, 255))
    d.text((x, 258), "Un sistema", font=titulo, fill=(160, 160, 160))
    d.text((x, 348), "para tu taller.", font=titulo, fill=(160, 160, 160))

    d.text((x, 474), "Precios de lanzamiento · Garantía digital · Portal", font=clash(28, 400), fill=(215, 215, 215))
    d.text((x, 540), "KRISTALL FILM", font=clash(28, 600), fill=(255, 255, 255))

    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    lienzo.save(SALIDA, "JPEG", quality=82, optimize=True, progressive=True)
    print(f"{SALIDA.relative_to(RAIZ)} — {SALIDA.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
