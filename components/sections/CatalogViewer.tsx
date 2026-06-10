'use client'

import { useState, useEffect } from 'react'
import { Download, BookOpen, X } from 'lucide-react'

const PDF_URL = '/catalogo/kristall-catalogo-2025.pdf'
const FLIPBOOK_URL = 'https://heyzine.com/flip-book/99d9661b85.html'

export default function CatalogViewer() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Sección de entrada */}
      <section className="bg-[#0A0A0A] py-10 md:py-16 px-6 md:px-10">
        <div className="max-w-[1160px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/30 font-medium mb-3">
              Catálogo digital
            </p>
            <h2
              className="text-2xl font-medium text-white mb-3 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Especificaciones completas<br />de todas las líneas
            </h2>
            <p className="text-sm text-white/40 leading-relaxed max-w-[380px]">
              Consultá el catálogo técnico completo de Kristall Film con todas
              las referencias, especificaciones y garantías.
            </p>
          </div>
          <div className="flex flex-col xs:flex-row sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
            <button
              onClick={() => setOpen(true)}
              className="bg-white text-[#0A0A0A] px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <BookOpen size={15} />
              Ver catálogo
            </button>
            <a
              href={PDF_URL}
              download="Kristall-Catalogo-2025.pdf"
              className="border border-white/20 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Download size={15} />
              Descargar PDF
            </a>
          </div>
        </div>
      </section>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          {/* Overlay blur */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          {/* Modal container */}
          <div className="relative z-10 w-full max-w-5xl h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl">

            {/* Header del modal */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#0A0A0A] border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-[3px]">
                  <span className="w-3 h-[2px] rounded-sm bg-white/20 block" />
                  <span className="w-3 h-[2px] rounded-sm bg-[#CC0000] block" />
                  <span className="w-3 h-[2px] rounded-sm bg-[#E6A800] block" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-white/40 font-medium">
                  Catálogo Kristall Film 2026
                </p>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={PDF_URL}
                  download="Kristall-Catalogo-2025.pdf"
                  className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={12} />
                  Descargar
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  <X size={14} />
                  Cerrar
                </button>
              </div>
            </div>

            {/* Flipbook iframe */}
            <div className="flex-1 bg-[#111111]">
              <iframe
                src={FLIPBOOK_URL}
                seamless
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full border-0"
                title="Catálogo Kristall Film 2026"
              />
            </div>

          </div>
        </div>
      )}
    </>
  )
}
