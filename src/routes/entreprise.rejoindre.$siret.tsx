import { createFileRoute } from '@tanstack/react-router'
import { useLoginManagement } from '../core/context/loginManagement/loginManagementContext'
import { UserActivation } from '../feature/Users/UserActivation'

export const Route = createFileRoute('/entreprise/rejoindre/$siret')({
  validateSearch: (search: Record<string, unknown>): { token: string } => {
    return {
      token: (search.token as string) || '',
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { siret } = Route.useParams()
  const { token } = Route.useSearch()
  const { setConnectedUser } = useLoginManagement()
  return (
    <UserActivation
      urlToken={token}
      siret={siret}
      onUserActivated={setConnectedUser}
    />
  )
}
