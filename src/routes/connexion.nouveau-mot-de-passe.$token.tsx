import {createFileRoute} from '@tanstack/react-router'
import {ResetPassword} from "../feature/ResetPassword/ResetPassword";

export const Route = createFileRoute('/connexion/nouveau-mot-de-passe/$token')({
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useParams()
  return <ResetPassword token={token} />
}
