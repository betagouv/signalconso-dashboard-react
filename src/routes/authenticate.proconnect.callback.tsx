import { createFileRoute } from '@tanstack/react-router'
import { useLoginManagement } from '../core/context/loginManagement/loginManagementContext'
import ProConnectCallback from '../feature/Login/ProConnectCallback'

export const Route = createFileRoute('/authenticate/proconnect/callback')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Authentification proconnect' }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { loginProConnect } = useLoginManagement()
  return <ProConnectCallback {...{ loginProConnect }} />
}
