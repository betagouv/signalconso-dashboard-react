import { createFileRoute } from '@tanstack/react-router'
import { AgentUsersList } from '../../../feature/Users/UsersList'

export const Route = createFileRoute('/_authenticated/users/agent')({
  component: AgentUsersList,
})
