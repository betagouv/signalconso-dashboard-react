import { createFileRoute } from '@tanstack/react-router'
import { useConnectedContext } from '../../../../core/context/connected/connectedContext'
import { useGetCompanyByIdQuery } from '../../../../core/queryhooks/companyQueryHooks'
import { CompanyStats } from '../../../../feature/Company/CompanyStats'
import { CompanyStatsPro } from '../../../../feature/Company/CompanyStatsPro'

export const Route = createFileRoute(
  '/_authenticated/entreprise/$companyId/bilan',
)({
  head: () => ({
    meta: [{ title: "Espace pro Signal Conso : statistiques de l'entreprise" }],
  }),
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
