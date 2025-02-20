import {createFileRoute, redirect} from '@tanstack/react-router'
import {ProLoginForm} from "../feature/Login/ProLoginForm";
import {useLoginManagement} from "../core/useLoginManagement";

export const Route = createFileRoute('/connexion/')({
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
  const {login} = useLoginManagement()
  return <ProLoginForm {...{ login }} />
}
