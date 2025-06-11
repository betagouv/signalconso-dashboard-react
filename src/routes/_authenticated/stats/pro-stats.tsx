import { createFileRoute } from '@tanstack/react-router'
import { ProStats } from '../../../feature/Stats/ProStats'

export const Route = createFileRoute('/_authenticated/stats/pro-stats')({
  head: () => ({
    meta: [
      { title: 'Espace pro Signal Conso : Statistiques des professionnels' },
    ],
  }),
  component: ProStats,
})
