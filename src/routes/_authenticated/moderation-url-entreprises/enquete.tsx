import { createFileRoute } from '@tanstack/react-router'
import { WebsitesInvestigation } from '../../../feature/ReportedWebsites/WebsitesInvestigation'

export const Route = createFileRoute(
  '/_authenticated/moderation-url-entreprises/enquete',
)({
  component: WebsitesInvestigation,
})
