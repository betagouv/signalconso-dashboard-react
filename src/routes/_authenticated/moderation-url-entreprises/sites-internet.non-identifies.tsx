import { createFileRoute } from '@tanstack/react-router'
import { ReportedUnknownWebsites } from '../../../feature/ReportedWebsites/ReportedUnknownWebsites'

export const Route = createFileRoute(
  '/_authenticated/moderation-url-entreprises/sites-internet/non-identifies',
)({
  component: ReportedUnknownWebsites,
})
