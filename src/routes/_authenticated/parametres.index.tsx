import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '../../feature/Settings/Settings'

export const Route = createFileRoute('/_authenticated/parametres/')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : paramètres' }],
  }),
  component: Settings,
})
