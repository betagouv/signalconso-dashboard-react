import {createFileRoute} from '@tanstack/react-router'
import {useLoginManagement} from "../core/useLoginManagement";
import { UserActivation } from '../feature/Users/UserActivation'

export const Route = createFileRoute('/entreprise/rejoindre/$siret')({
  component: RouteComponent,
})

function RouteComponent() {
  const { siret } = Route.useParams()
  const {setConnectedUser} = useLoginManagement()
  return <UserActivation siret={siret} onUserActivated={setConnectedUser} />
}
