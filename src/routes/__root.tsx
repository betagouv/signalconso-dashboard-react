import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router'
import {
  LoginManagementResult,
  useLoginManagement,
} from '../core/context/loginManagement/loginManagementContext'
import { Layout } from '../core/Layout/Layout'
import { RedirectHashRouterToBrowserRouter } from '../RedirectHashRouterToBrowserRouter'

interface RouterContext {
  queryClient: QueryClient
  loginManagementResult: LoginManagementResult
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RouteComponent,
})

// TODO RedirectHashRouterToBrowserRouter used to redirect old routes, still necessary ?
function RouteComponent() {
  const loginManagementResult = useLoginManagement()
  return (
    <Layout {...{ loginManagementResult }}>
      <HeadContent />
      <RedirectHashRouterToBrowserRouter />
      <Outlet />
    </Layout>
  )
}
