import {createFileRoute, redirect} from '@tanstack/react-router'
import {ModeEmploiDGCCRF} from "../../feature/ModeEmploiDGCCRF/ModeEmploiDGCCRF";

export const Route = createFileRoute('/_authenticated/mode-emploi-dgccrf')({
  component: ModeEmploiDGCCRF,
  beforeLoad: ({context}) => {
    if (context.loginManagementResult.connectedUser?.role === 'Professionnel') {
      throw redirect({
        to: '/suivi-des-signalements'
      })
    }
  }
})
