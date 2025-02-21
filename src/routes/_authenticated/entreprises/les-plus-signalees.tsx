import { createFileRoute } from '@tanstack/react-router'
import { CompaniesRegistered } from '../../../feature/Companies/CompaniesRegistered'
import { CompanySearch } from '../../../core/client/company/Company'

export const Route = createFileRoute(
  '/_authenticated/entreprises/les-plus-signalees',
)({
  validateSearch: (search: Record<string, unknown>): CompanySearch => {
    return {
      departments: (search.departments as string[]) || undefined,
      activityCodes: (search.activityCodes as string[]) || undefined,
      emailsWithAccess: (search.emailsWithAccess as string) || undefined,
      identity: (search.identity as string) || undefined,

      offset: (search.offset as number) || 0,
      limit: (search.limit as number) || 25,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  return <CompaniesRegistered search={search} />
}
