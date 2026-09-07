'use client'

import { useEffect } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { RECORRIDOS, type PantallaConRecorrido } from '@/lib/client-portal/recorrido'

/**
 * El recorrido guiado de una pantalla.
 *
 * Arranca solo la primera vez que se llega, y no vuelve a aparecer en esa
 * sesión. Se recuerda en `sessionStorage` y no en el servidor porque es una
 * conveniencia de esta visita, no un dato del negocio: si alguien abre otra
 * pestaña y lo ve de nuevo no pasa nada, y no vale una columna en la base.
 *
 * ─── Un paso sin ancla se saltea ───────────────────────────────────────────
 *
 * Cada paso apunta a un `data-tour` del componente real, y alguien va a
 * refactorizar una pantalla sin acordarse de esto. Que un paso huérfano rompa el
 * recorrido entero delante de un prospecto sería el peor resultado posible, así
 * que se filtra antes de arrancar: se pierde un globito y nada más.
 *
 * En desarrollo además avisa por consola cuáles faltan, que es cuando alguien
 * puede arreglarlo.
 */
export default function Recorrido({
  pantalla,
  activo,
}: {
  pantalla: PantallaConRecorrido
  /** Solo se dispara en las sesiones donde corresponde. */
  activo: boolean
}) {
  useEffect(() => {
    if (!activo) return

    const clave = `recorrido:${pantalla}`
    try {
      if (sessionStorage.getItem(clave)) return
      sessionStorage.setItem(clave, '1')
    } catch {
      // Sin sessionStorage (ventana privada, cookies bloqueadas) el recorrido
      // se muestra igual. Repetirlo es molesto; no mostrarlo nunca es peor.
    }

    const pasos = RECORRIDOS[pantalla] ?? []
    const disponibles = pasos.filter((p) => !p.ancla || document.querySelector(`[data-tour="${p.ancla}"]`))

    if (process.env.NODE_ENV !== 'production') {
      const huerfanos = pasos.filter((p) => p.ancla && !document.querySelector(`[data-tour="${p.ancla}"]`))
      if (huerfanos.length) {
        console.warn(
          `[recorrido:${pantalla}] pasos sin ancla en el DOM:`,
          huerfanos.map((p) => p.ancla).join(', ')
        )
      }
    }

    if (disponibles.length === 0) return

    // Un respiro antes de arrancar: la pantalla termina de dibujarse y el
    // resaltado cae sobre el elemento ya ubicado, no sobre donde estaba.
    const t = setTimeout(() => {
      driver({
        showProgress: disponibles.length > 1,
        nextBtnText: 'Siguiente',
        prevBtnText: 'Atrás',
        doneBtnText: 'Listo',
        progressText: '{{current}} de {{total}}',
        steps: disponibles.map((p) => ({
          element: p.ancla ? `[data-tour="${p.ancla}"]` : undefined,
          popover: { title: p.titulo, description: p.texto },
        })),
      }).drive()
    }, 400)

    return () => clearTimeout(t)
  }, [pantalla, activo])

  return null
}
