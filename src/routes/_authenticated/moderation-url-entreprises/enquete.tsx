import { createFileRoute } from '@tanstack/react-router'
import { WebsitesInvestigation } from '../../../feature/ReportedWebsites/WebsitesInvestigation'
import {
  IdentificationStatus,
  InvestigationStatus,
  WebsiteWithCompanySearch,
} from '../../../core/client/website/Website'
import { unknownToBoolean } from '../../../core/helper'

export const Route = createFileRoute(
  '/_authenticated/moderation-url-entreprises/enquete',
)({
  validateSearch: (
    search: Record<string, unknown>,
  ): WebsiteWithCompanySearch => {
    const begin = new Date()
    begin.setDate(begin.getDate() - 90)
    begin.setHours(0, 0, 0, 0)

    return {
      host: (search.host as string) || undefined,
      isOpen: unknownToBoolean(search.isOpen) || null,
      identificationStatus:
        (search.identificationStatus as IdentificationStatus[]) || [
          IdentificationStatus.NotIdentified,
        ],
      investigationStatus:
        (search.investigationStatus as InvestigationStatus[]) || [
          InvestigationStatus.NotProcessed,
          InvestigationStatus.Processing,
        ],
      start: search.start ? new Date(search.start as string) : begin,
      end: search.end ? new Date(search.end as string) : undefined,
      isMarketplace: unknownToBoolean(search.isMarketplace) || null,

      offset: (search.offset as number) || 0,
      limit: (search.limit as number) || 25,
    }
  },
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Sites web signalés' }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  return <WebsitesInvestigation search={search} />
}
