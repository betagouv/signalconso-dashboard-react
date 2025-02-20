import {createFileRoute, redirect} from '@tanstack/react-router'
import {RegisterForm} from "../feature/Login/RegisterForm";
import {useLoginManagement} from "../core/useLoginManagement";

export const Route = createFileRoute('/activation')({
  beforeLoad: ({context}) => {
    if (context.loginManagementResult.isAuthenticated()) {
      throw redirect({
        to: '/entreprise/activation'
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const {register} = useLoginManagement()
  return <RegisterForm register={register} />
}
