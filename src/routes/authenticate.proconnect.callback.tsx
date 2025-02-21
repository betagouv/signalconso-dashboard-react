import { createFileRoute } from '@tanstack/react-router'
import ProConnectCallback from '../feature/Login/ProConnectCallback'
import { useLoginManagement } from '../core/useLoginManagement'

export const Route = createFileRoute('/authenticate/proconnect/callback')({
  component: RouteComponent,
})

function RouteComponent() {
  const { loginProConnect } = useLoginManagement()
  return <ProConnectCallback {...{ loginProConnect }} />
}
