import { createFileRoute } from '@tanstack/react-router'
import {useLoginManagement} from "../core/useLoginManagement";
import {UserActivation} from "../feature/Users/UserActivation";

export const Route = createFileRoute('/admin/rejoindre')({
  component: RouteComponent,
})

function RouteComponent() {
  const {setConnectedUser} = useLoginManagement()
  return <UserActivation onUserActivated={setConnectedUser} />
}
