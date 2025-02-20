import { createFileRoute } from '@tanstack/react-router'
import {EmailValidation} from "../feature/EmailValidation/EmailValidation";
import {useLoginManagement} from "../core/useLoginManagement";

export const Route = createFileRoute('/connexion/validation-email')({
  component: RouteComponent,
})

function RouteComponent() {
  const {setConnectedUser} = useLoginManagement()
  return <EmailValidation onSaveUser={setConnectedUser} />
}
