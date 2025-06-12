import { createFileRoute } from '@tanstack/react-router'
import { DgccrfStats } from '../../../feature/Stats/DgccrfStats'

export const Route = createFileRoute('/_authenticated/stats/dgccrf-stats')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Statistiques DGCCRF' }],
  }),
  component: DgccrfStats,
})
