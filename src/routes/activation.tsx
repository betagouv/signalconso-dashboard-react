import { createFileRoute, redirect } from '@tanstack/react-router'
import { useLoginManagement } from '../core/context/loginManagement/loginManagementContext'
import { RegisterForm } from '../feature/Login/RegisterForm'

interface ActivationSearch {
  siret?: string
  code?: string
}

export const Route = createFileRoute('/activation')({
  beforeLoad: ({ context }) => {
    if (context.loginManagementResult.isAuthenticated()) {
      throw redirect({
        to: '/entreprise/activation',
      })
    }
  },
  validateSearch: (search: Record<string, unknown>): ActivationSearch => {
    return {
      siret: (search.siret as string) || undefined,
      code: (search.code as string) || undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { register } = useLoginManagement()
  const { siret, code } = Route.useSearch()
  return <RegisterForm register={register} siret={siret} code={code} />
}
