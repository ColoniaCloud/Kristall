import type { Metadata } from 'next'
import { metadataInvitacion, PaginaInvitacion } from '@/components/distribuidores-peru/PaginaInvitacion'

/** /distribuidores-argentina/<token>: la propuesta personalizada. Ver PaginaInvitacion. */
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ token: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return metadataInvitacion((await params).token, 'AR')
}

export default async function InvitacionArgentinaPage({ params }: Props) {
  return <PaginaInvitacion token={(await params).token} pais="AR" />
}
