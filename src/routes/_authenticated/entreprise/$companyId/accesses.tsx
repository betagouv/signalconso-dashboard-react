import { createFileRoute } from '@tanstack/react-router'
import { CompanyAccesses } from '../../../../feature/CompanyAccesses/CompanyAccesses'
import { useGetCompanyByIdQuery } from '../../../../core/queryhooks/companyQueryHooks'

export const Route = createFileRoute(
  '/_authenticated/entreprise/$companyId/accesses',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { companyId } = Route.useParams()
  const _companyById = useGetCompanyByIdQuery(companyId)
  const company = _companyById.data
  return <CompanyAccesses {...{ company }} />
}
