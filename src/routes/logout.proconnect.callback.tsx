import { createFileRoute } from '@tanstack/react-router'
import ProConnectLogoutCallback from '../feature/Login/ProConnectLogoutCallback'

export const Route = createFileRoute('/logout/proconnect/callback')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Déconnexion proconnect' }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <ProConnectLogoutCallback />
}
