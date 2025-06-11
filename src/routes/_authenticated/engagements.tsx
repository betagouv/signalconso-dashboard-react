import { createFileRoute } from '@tanstack/react-router'
import { Engagements } from '../../feature/Engagement/Engagements'

export const Route = createFileRoute('/_authenticated/engagements')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Mes engagements' }],
  }),
  component: Engagements,
})
