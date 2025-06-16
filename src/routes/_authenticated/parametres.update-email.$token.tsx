import { createFileRoute } from '@tanstack/react-router'
import { UpdateEmail } from '../../feature/Settings/UpdateEmail'

export const Route = createFileRoute(
  '/_authenticated/parametres/update-email/$token',
)({
  head: () => ({
    meta: [{ title: "Espace pro Signal Conso : Modification de l'email" }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useParams()
  return <UpdateEmail token={token} />
}
