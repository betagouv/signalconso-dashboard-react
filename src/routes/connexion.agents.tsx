import { createFileRoute, redirect } from '@tanstack/react-router'
import { useLoginManagement } from '../core/useLoginManagement'
import { AgentLoginForm } from '../feature/Login/AgentLoginForm'

type AgentLoginFormSearch = {
  redirect?: string
}

export const Route = createFileRoute('/connexion/agents')({
  beforeLoad: ({ context }) => {
    if (context.loginManagementResult.isAuthenticated()) {
      throw redirect({
        to: '/suivi-des-signalements',
      })
    }
  },
  validateSearch: (search: Record<string, unknown>): AgentLoginFormSearch => {
    return {
      redirect: (search.redirect as string) || undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { redirect } = Route.useSearch()
  const { login, startProConnect } = useLoginManagement()
  return <AgentLoginForm {...{ login, startProConnect, redirect }} />
}
