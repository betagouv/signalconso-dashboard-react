import { createFileRoute } from '@tanstack/react-router'
import { useConnectedContext } from '../../../../core/context/ConnectedContext'
import { useGetCompanyByIdQuery } from '../../../../core/queryhooks/companyQueryHooks'
import { CompanyStatsPro } from '../../../../feature/Company/CompanyStatsPro'
import { CompanyStats } from '../../../../feature/Company/CompanyStats'

export const Route = createFileRoute(
  '/_authenticated/entreprise/$companyId/bilan',
)({
  component: CompanyStatsVariantSwitch,
})

function CompanyStatsVariantSwitch() {
  const { companyId } = Route.useParams()
  const { connectedUser } = useConnectedContext()
  const _companyById = useGetCompanyByIdQuery(companyId)
  const company = _companyById.data
  return (
    <>
      {company &&
        (connectedUser.isPro ? (
          <CompanyStatsPro {...{ company, connectedUser }} />
        ) : (
          <CompanyStats {...{ company, connectedUser }} />
        ))}
    </>
  )
}
