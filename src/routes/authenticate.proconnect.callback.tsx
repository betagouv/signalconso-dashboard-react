import { createFileRoute } from '@tanstack/react-router'
import { useLoginManagement } from '../core/context/loginManagement/loginManagementContext'
import ProConnectCallback from '../feature/Login/ProConnectCallback'

export const Route = createFileRoute('/authenticate/proconnect/callback')({
  component: RouteComponent,
})

function RouteComponent() {
  const { loginProConnect } = useLoginManagement()
  return <ProConnectCallback {...{ loginProConnect }} />
}
