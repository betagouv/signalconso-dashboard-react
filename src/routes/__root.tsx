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
  head: () => ({
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#000000' },
      {
        name: 'description',
        content:
          "L'espace Pro vous permet de gérer et consulter les signalements dont vous faites l'objet",
      },
      { name: 'robots', content: 'noindex' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
      { rel: 'stylesheet', href: '/fonts.css' },
    ],
  }),
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
