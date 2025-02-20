import { createFileRoute } from '@tanstack/react-router'
import ProConnectLogoutCallback from "../feature/Login/ProConnectLogoutCallback";

export const Route = createFileRoute('/logout/proconnect/callback')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProConnectLogoutCallback />
}
