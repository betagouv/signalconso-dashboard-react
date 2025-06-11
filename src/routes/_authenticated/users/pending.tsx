import { createFileRoute } from '@tanstack/react-router'
import { UsersAgentListPending } from '../../../feature/Users/UsersAgentListPending'

export const Route = createFileRoute('/_authenticated/users/pending')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Agents en attente' }],
  }),
  component: UsersAgentListPending,
})
