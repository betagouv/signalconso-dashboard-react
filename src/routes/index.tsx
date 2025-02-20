import {createFileRoute, redirect} from "@tanstack/react-router";
import {WelcomePage} from "../feature/Login/WelcomePage";

export const Route = createFileRoute('/')({
  beforeLoad: ({context}) => {
    if (context.loginManagementResult.isAuthenticated()) {
      throw redirect({
        to: '/suivi-des-signalements'
      })
    }
},
  component: WelcomePage,
})