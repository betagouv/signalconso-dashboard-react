import { createFileRoute } from '@tanstack/react-router'
import { ConsumerListPending } from '../../../feature/Users/ConsumerListPending'

export const Route = createFileRoute('/_authenticated/users/consumers')({
  component: ConsumerListPending,
})
