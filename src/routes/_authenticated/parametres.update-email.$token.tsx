import { createFileRoute } from '@tanstack/react-router'
import { UpdateEmail } from '../../feature/Settings/UpdateEmail'

export const Route = createFileRoute(
  '/_authenticated/parametres/update-email/$token',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useParams()
  return <UpdateEmail token={token} />
}
