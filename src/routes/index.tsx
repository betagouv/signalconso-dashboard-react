import { createFileRoute, redirect } from '@tanstack/react-router'
import { WelcomePage } from '../feature/Login/WelcomePage'

type WelcomePageSearch = {
  redirect?: string
}

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.loginManagementResult.isAuthenticated()) {
      throw redirect({
        to: '/suivi-des-signalements',
      })
    }
  },
  validateSearch: (search: Record<string, unknown>): WelcomePageSearch => {
    return {
      redirect: (search.redirect as string) || undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { redirect } = Route.useSearch()
  return <WelcomePage redirect={redirect} />
}
