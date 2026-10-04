"""
Genera public/catalogo-propuesta/ventanilla-mascara.png — la forma exacta del
vidrio de la ventanilla en public/cat/ingresar.jpg, para el simulador de VLT de
/catalogo-propuesta (components/catalogo-propuesta/Simulador.tsx).

Reemplaza a un polígono trazado a mano, que nunca terminaba de coincidir con la
curva de la esquina ni con el parante. Cómo sale la forma:

1. El vidrio es lo claro (cielo y nubes, brillo L > 110) y el marco es casi
   negro (L < 30): el umbral es estable entre 90 y 130.
2. Se queda con la zona clara conectada a un punto que cae dentro de la
   ventanilla (70 %, 25 %); el parabrisas queda afuera porque lo separa el
   parante, que es oscuro.
3. Envolvente convexa: suma el espejo retrovisor (que se ve a través del vidrio
   pero es oscuro) y las nubes más grises, sin pasarse al marco — la ventanilla
   es convexa. Agrega ~2 % sobre lo detectado.
4. Borde suavizado 1-2 px para que no se vea dentado.

Si se cambia la foto, hay que volver a correrlo (y revisar el punto semilla).

Uso (desde kristall-web/):  python scripts/mascara-simulador.py
Requiere: pip install opencv-python numpy
"""

from pathlib import Path

import cv2
import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
FOTO = RAIZ / "public/cat/ingresar.jpg"
SALIDA = RAIZ / "public/catalogo-propuesta/ventanilla-mascara.png"

UMBRAL = 110
SEMILLA = (0.70, 0.25)  # (x, y) en fracción de la foto, dentro del vidrio
ANCHO_SALIDA = 1280  # alcanza para la foto a 640 px en pantallas 2x


def main() -> None:
    im = cv2.imread(str(FOTO))
    alto, ancho = im.shape[:2]
    brillo = cv2.cvtColor(im, cv2.COLOR_BGR2LAB)[:, :, 0]

    claro = (brillo > UMBRAL).astype(np.uint8)
    _, zonas = cv2.connectedComponents(claro, connectivity=4)
    sx, sy = int(ancho * SEMILLA[0]), int(alto * SEMILLA[1])
    vidrio = (zonas == zonas[sy, sx]).astype(np.uint8)

    contornos, _ = cv2.findContours(vidrio, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    envolvente = cv2.convexHull(max(contornos, key=cv2.contourArea))
    mascara = np.zeros((alto, ancho), np.uint8)
    cv2.fillPoly(mascara, [envolvente], 255, lineType=cv2.LINE_AA)

    mascara = cv2.GaussianBlur(mascara, (0, 0), sigmaX=1.2)
    alto_salida = round(alto * ANCHO_SALIDA / ancho)
    mascara = cv2.resize(mascara, (ANCHO_SALIDA, alto_salida), interpolation=cv2.INTER_AREA)

    # Blanco con la forma en el canal alfa: `mask-image` usa el alfa.
    rgba = np.dstack([np.full_like(mascara, 255)] * 3 + [mascara])
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(SALIDA), rgba, [cv2.IMWRITE_PNG_COMPRESSION, 9])
    print(f"{SALIDA.relative_to(RAIZ)} — {SALIDA.stat().st_size // 1024} KB, {ANCHO_SALIDA}x{alto_salida}")


if __name__ == "__main__":
    main()
