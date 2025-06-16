import { createFileRoute } from '@tanstack/react-router'
import { useLoginManagement } from '../core/context/loginManagement/loginManagementContext'
import { EmailValidation } from '../feature/EmailValidation/EmailValidation'

type EmailValidationSearch = {
  token: string
}

export const Route = createFileRoute('/connexion/validation-email')({
  validateSearch: (search: Record<string, unknown>): EmailValidationSearch => {
    return {
      token: (search.token as string) || '',
    }
  },
  head: () => ({
    meta: [{ title: "Espace pro Signal Conso : Validation de l'email" }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch()
  const { setConnectedUser } = useLoginManagement()

  return <EmailValidation onSaveUser={setConnectedUser} token={token} />
}
