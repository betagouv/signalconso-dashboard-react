import { createFileRoute } from '@tanstack/react-router'
import { ReportedUnknownWebsites } from '../../../feature/ReportedWebsites/ReportedUnknownWebsites'

export const Route = createFileRoute(
  '/_authenticated/moderation-url-entreprises/sites-internet/non-identifies',
)({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Sites web non identifiés' }],
  }),
  component: ReportedUnknownWebsites,
})
