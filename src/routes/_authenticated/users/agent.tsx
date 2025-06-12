import { createFileRoute } from '@tanstack/react-router'
import { AgentUsersList } from '../../../feature/Users/UsersList'

export const Route = createFileRoute('/_authenticated/users/agent')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Agents' }],
  }),
  component: AgentUsersList,
})
