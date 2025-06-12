import { createFileRoute } from '@tanstack/react-router'
import { Subscriptions } from '../../feature/Subscriptions/Subscriptions'

export const Route = createFileRoute('/_authenticated/abonnements')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Abonnements' }],
  }),
  component: Subscriptions,
})
