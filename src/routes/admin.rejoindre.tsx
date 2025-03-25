import { createFileRoute } from '@tanstack/react-router'
import { useLoginManagement } from '../core/context/loginManagement/loginManagementContext'
import { UserActivation } from '../feature/Users/UserActivation'

export const Route = createFileRoute('/admin/rejoindre')({
  validateSearch: (search: Record<string, unknown>): { token: string } => {
    return {
      token: (search.token as string) || '',
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch()
  const { setConnectedUser } = useLoginManagement()
  return <UserActivation urlToken={token} onUserActivated={setConnectedUser} />
}
