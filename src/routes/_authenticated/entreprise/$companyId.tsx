import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useConnectedContext } from '../../../core/context/connected/connectedContext'
import {
  useGetCompanyByIdQuery,
  useIsAllowedToManageCompanyAccessesQuery,
} from '../../../core/queryhooks/companyQueryHooks'
import { CompanyPageTitle } from '../../../feature/Company/CompanyPageTitle'
import { Page } from '../../../shared/Page'
import { PageTab, PageTabs } from '../../../shared/Page/PageTabs'
import { Route as accessesRoute } from './$companyId/accesses'
import { Route as bilanRoute } from './$companyId/bilan'
import { Route as historyRoute } from './$companyId/history'

export const Route = createFileRoute('/_authenticated/entreprise/$companyId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { companyId } = Route.useParams()
  const _companyById = useGetCompanyByIdQuery(companyId)
  const { connectedUser } = useConnectedContext()
  const withCompanyAccessesTab =
    useIsAllowedToManageCompanyAccessesQuery(companyId) ?? false
  const company = _companyById.data
  return (
    <Page loading={_companyById.isLoading}>
      {company && <CompanyPageTitle {...{ company }} />}
      <PageTabs>
        <PageTab
          navigateOptions={{ to: bilanRoute.to, params: { companyId } }}
          label={'Statistiques'}
        />
        {withCompanyAccessesTab ? (
          <PageTab
            navigateOptions={{ to: accessesRoute.to, params: { companyId } }}
            label={'Accès utilisateurs'}
          />
        ) : (
          <></>
        )}
        {connectedUser.isNotPro ? (
          <PageTab
            navigateOptions={{ to: historyRoute.to, params: { companyId } }}
            label={`Historique de l'entreprise`}
          />
        ) : undefined}
      </PageTabs>
      <Outlet />
    </Page>
  )
}
