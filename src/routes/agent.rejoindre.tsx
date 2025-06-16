import { createFileRoute } from '@tanstack/react-router'
import { useLoginManagement } from '../core/context/loginManagement/loginManagementContext'
import { UserActivation } from '../feature/Users/UserActivation'

export const Route = createFileRoute('/agent/rejoindre')({
  validateSearch: (search: Record<string, unknown>): { token: string } => {
    return {
      token: (search.token as string) || '',
    }
  },
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Activation du compte agent' }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch()
  const { setConnectedUser } = useLoginManagement()
  return <UserActivation urlToken={token} onUserActivated={setConnectedUser} />
}
