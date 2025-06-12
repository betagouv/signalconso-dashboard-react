import { createFileRoute } from '@tanstack/react-router'
import { CompaniesPro } from 'feature/CompaniesPro/CompaniesPro'

export const Route = createFileRoute('/_authenticated/mes-entreprises')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : mes entreprises' }],
  }),
  component: CompaniesPro,
})
