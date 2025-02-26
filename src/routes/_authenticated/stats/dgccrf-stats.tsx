import { createFileRoute } from '@tanstack/react-router'
import { DgccrfStats } from '../../../feature/Stats/DgccrfStats'

export const Route = createFileRoute('/_authenticated/stats/dgccrf-stats')({
  component: DgccrfStats,
})
