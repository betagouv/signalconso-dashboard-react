import { createFileRoute } from '@tanstack/react-router'
import { ReportStats } from '../../../feature/Stats/ReportStats'

export const Route = createFileRoute('/_authenticated/stats/report-stats')({
  head: () => ({
    meta: [
      { title: 'Espace pro Signal Conso : Statistiques des signalements' },
    ],
  }),
  component: ReportStats,
})
