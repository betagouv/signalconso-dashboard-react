import { createFileRoute, redirect } from '@tanstack/react-router'
import { ModeEmploiDGCCRF } from '../../feature/ModeEmploiDGCCRF/ModeEmploiDGCCRF'

export const Route = createFileRoute('/_authenticated/mode-emploi-dgccrf')({
  head: () => ({
    meta: [{ title: "Espace pro Signal Conso : mode d'emploi DGCCRF" }],
  }),
  component: ModeEmploiDGCCRF,
  beforeLoad: ({ context }) => {
    if (context.loginManagementResult.connectedUser?.role === 'Professionnel') {
      throw redirect({
        to: '/suivi-des-signalements',
      })
    }
  },
})
