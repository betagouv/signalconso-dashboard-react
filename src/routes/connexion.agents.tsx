import {createFileRoute, redirect} from '@tanstack/react-router'
import {useLoginManagement} from "../core/useLoginManagement";
import {AgentLoginForm} from "../feature/Login/AgentLoginForm";

export const Route = createFileRoute('/connexion/agents')({
  beforeLoad: ({context}) => {
    if (context.loginManagementResult.isAuthenticated()) {
      throw redirect({
        to: '/suivi-des-signalements'
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const {login, startProConnect} = useLoginManagement()
  return <AgentLoginForm {...{ login, startProConnect }} />
}
