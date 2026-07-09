declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/** Dispara el evento de conversión `generate_lead` en GA4. Silencioso si GA4 no está cargado. */
export function trackLead(source: string) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'generate_lead', { source })
}
