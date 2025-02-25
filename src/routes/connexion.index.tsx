import { createFileRoute, redirect } from '@tanstack/react-router'
import { ProLoginForm } from '../feature/Login/ProLoginForm'
import { useLoginManagement } from '../core/useLoginManagement'

type ProLoginFormSearch = {
  redirect?: string
}

export const Route = createFileRoute('/connexion/')({
  beforeLoad: ({ context }) => {
    if (context.loginManagementResult.isAuthenticated()) {
      throw redirect({
        to: '/suivi-des-signalements',
      })
    }
  },
  validateSearch: (search: Record<string, unknown>): ProLoginFormSearch => {
    return {
      redirect: (search.redirect as string) || undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { redirect } = Route.useSearch()
  const { login } = useLoginManagement()
  return <ProLoginForm {...{ login, redirect }} />
}
