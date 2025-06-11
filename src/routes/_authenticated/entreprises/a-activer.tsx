import { createFileRoute } from '@tanstack/react-router'
import { CompaniesToActivate } from '../../../feature/Companies/CompaniesToActivate'

export const Route = createFileRoute('/_authenticated/entreprises/a-activer')({
  head: () => ({
    meta: [
      {
        title: "Espace pro Signal Conso : Entreprises en attente d'activation",
      },
    ],
  }),
  component: CompaniesToActivate,
})
