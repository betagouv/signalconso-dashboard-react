import {createFileRoute, Outlet} from '@tanstack/react-router'
import {
  useGetCompanyByIdQuery,
  useIsAllowedToManageCompanyAccessesQuery
} from "../../../core/queryhooks/companyQueryHooks";
import {useConnectedContext} from "../../../core/context/ConnectedContext";
import {CompanyPageTitle} from "../../../feature/Company/CompanyPageTitle";
import {Page} from "../../../shared/Page";
import {PageTab, PageTabs} from "../../../shared/Page/PageTabs";
import { Route as bilanRoute } from './$companyId/bilan'
import { Route as accessesRoute } from './$companyId/accesses'
import { Route as historyRoute } from './$companyId/history'

export const Route = createFileRoute('/_authenticated/entreprise/$companyId')({
  component: RouteComponent,
})

function RouteComponent() {
  const {companyId} = Route.useParams()
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
                 to={bilanRoute.to}
                 label={'Statistiques'}
               />
               {withCompanyAccessesTab ? (
                 <PageTab
                   to={accessesRoute.to}
                   label={'Accès utilisateurs'}
                 />
               ) : (
                 <></>
               )}
               {connectedUser.isNotPro ? (
                 <PageTab
                   to={historyRoute.to}
                   label={`Historique de l'entreprise`}
                 />
               ) : undefined}
             </PageTabs>
      <Outlet />
    </Page>
  )
}
