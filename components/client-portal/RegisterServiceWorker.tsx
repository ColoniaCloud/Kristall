'use client'

import { useEffect } from 'react'

export default function RegisterServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/cliente/sw.js').catch(() => {})
    }
  }, [])

  return null
}
