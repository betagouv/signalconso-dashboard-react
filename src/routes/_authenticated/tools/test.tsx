import { createFileRoute } from '@tanstack/react-router'
import { TestTools } from '../../../feature/AdminTools/TestTools'

export const Route = createFileRoute('/_authenticated/tools/test')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Outils de test' }],
  }),
  component: TestTools,
})
