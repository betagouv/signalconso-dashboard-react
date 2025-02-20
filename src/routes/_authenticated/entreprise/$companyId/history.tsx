import { createFileRoute } from '@tanstack/react-router'
import {useGetCompanyByIdQuery} from "../../../../core/queryhooks/companyQueryHooks";
import {CompanyHistory} from "../../../../feature/Company/CompanyHistory";

export const Route = createFileRoute(
  '/_authenticated/entreprise/$companyId/history',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const {companyId} = Route.useParams()
  const _companyById = useGetCompanyByIdQuery(companyId)
  const company = _companyById.data
  return <CompanyHistory {...{ company }} />
}
