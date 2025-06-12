import { createFileRoute } from '@tanstack/react-router'
import { ReportsPro } from '../../feature/ReportsPro/ReportsPro'
import { ReportProSearch } from '../../core/client/report/ReportSearch'
import { PaginatedFilters, ReportStatus } from '../../core/model'
import { unknownToBoolean } from '../../core/helper'

export const Route = createFileRoute(
  '/_authenticated/suivi-des-signalements-clotures',
)({
  validateSearch: (
    search: Record<string, unknown>,
  ): ReportProSearch & Partial<PaginatedFilters> => {
    return {
      departments: (search.departments as string[]) || undefined,
      siretSirenList: (search.siretSirenList as string[]) || undefined,
      status: (search.status as ReportStatus[]) || undefined,
      start: search.start ? new Date(search.start as string) : undefined,
      end: search.end ? new Date(search.end as string) : undefined,
      hasWebsite: unknownToBoolean(search.hasWebsite),
      fullText: (search.fullText as string) || undefined,

      offset: (search.offset as number) || 0,
      limit: (search.limit as number) || 25,
    }
  },
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : signalements clôturés' }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  return <ReportsPro reportType="closed" search={search} />
}
