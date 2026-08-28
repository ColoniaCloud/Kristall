'use client'

import { useTranslations } from 'next-intl'
import { Download } from 'lucide-react'

/** Barra de descarga del catálogo PDF, entre el hero de /productos y el listado. */
export default function CatalogDownloadBar() {
  const t = useTranslations('products_page')

  return (
    <div className="bg-[#0A0A0A]">
      <div className="px-4 md:px-10 py-4 max-w-[1160px] mx-auto flex items-center justify-between gap-4">
        <p className="text-sm md:text-base text-white font-medium">
          {t('catalog_download_text')}
        </p>
        <a
          href="/Catalogo-Kristall-Film.pdf"
          download="Catalogo-Kristall-Film.pdf"
          className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-[#0A0A0A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-opacity"
        >
          <Download size={15} />
          {t('catalog_download_button')}
        </a>
      </div>
    </div>
  )
}
