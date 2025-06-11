import { createFileRoute } from '@tanstack/react-router'
import { ConsumerListPending } from '../../../feature/Users/ConsumerListPending'

export const Route = createFileRoute('/_authenticated/users/consumers')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Consommateurs non validés' }],
  }),
  component: ConsumerListPending,
})
