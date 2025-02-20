import {createRootRouteWithContext, Outlet} from "@tanstack/react-router";
import {LoginManagementResult, useLoginManagement} from "../core/useLoginManagement";
import {Layout} from "../core/Layout/Layout";
import {QueryClient} from "@tanstack/react-query";
import {RedirectHashRouterToBrowserRouter} from "../RedirectHashRouterToBrowserRouter";

interface RouterContext {
  queryClient: QueryClient
  loginManagementResult: LoginManagementResult
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RouteComponent,
})

function RouteComponent() {
  const loginManagementResult = useLoginManagement()
  return (
    <Layout {...{ loginManagementResult }}>
      <RedirectHashRouterToBrowserRouter />
      <Outlet />
    </Layout>
  )
}