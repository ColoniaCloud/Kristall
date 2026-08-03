import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'
import { withPayload } from '@payloadcms/next/withPayload'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  // Evita que Next.js infiera mal la raíz del workspace por lockfiles
  // ajenos al proyecto (p. ej. package-lock.json en el home del usuario).
  outputFileTracingRoot: import.meta.dirname,
};

export default withNextIntl(withPayload(nextConfig));
