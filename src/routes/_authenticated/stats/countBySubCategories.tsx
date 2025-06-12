import { createFileRoute } from '@tanstack/react-router'
import { ArborescenceWithCounts } from '../../../feature/Stats/ArborescenceWithCounts'
import { ReportNodeSearch } from '../../../core/client/report/ReportNodeSearch'

export const Route = createFileRoute(
  '/_authenticated/stats/countBySubCategories',
)({
  validateSearch: (search: Record<string, unknown>): ReportNodeSearch => {
    return {
      departments: (search.departments as string[]) || undefined,
      start: search.start ? new Date(search.start as string) : undefined,
      end: search.end ? new Date(search.end as string) : undefined,
    }
  },
  head: () => ({
    meta: [
      { title: 'Espace pro Signal Conso : Signalements par sous-catégories' },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  return <ArborescenceWithCounts search={search} />
}
