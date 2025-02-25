import { createFileRoute } from '@tanstack/react-router'
import { EmailValidation } from '../feature/EmailValidation/EmailValidation'
import { useLoginManagement } from '../core/useLoginManagement'

type EmailValidationSearch = {
  token: string
}

export const Route = createFileRoute('/connexion/validation-email')({
  validateSearch: (search: Record<string, unknown>): EmailValidationSearch => {
    return {
      token: (search.token as string) || '',
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch()
  const { setConnectedUser } = useLoginManagement()

  return <EmailValidation onSaveUser={setConnectedUser} token={token} />
}
