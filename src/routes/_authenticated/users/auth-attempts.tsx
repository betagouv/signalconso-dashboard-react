import { createFileRoute } from '@tanstack/react-router'
import { UserAuthAttempts } from '../../../feature/Users/UserAuthAttempts'

type AuthAttemptsSearch = {
  email?: string
}

export const Route = createFileRoute('/_authenticated/users/auth-attempts')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title:
          'Espace pro Signal Conso : Historique des tentatives de connexion',
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): AuthAttemptsSearch => {
    return {
      email: (search.email as string) || undefined,
    }
  },
})

function RouteComponent() {
  const { email } = Route.useSearch()
  return <UserAuthAttempts email={email} />
}
