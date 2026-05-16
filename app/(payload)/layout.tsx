import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import config from '../../payload.config'
import '@payloadcms/next/css'
import React from 'react'
import { importMap } from './admin/importMap'

export default async function Layout({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverFunction = async function (args: any) {
    'use server'
    return handleServerFunctions({ ...args, config })
  }

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
