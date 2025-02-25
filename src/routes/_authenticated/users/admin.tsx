import { createFileRoute } from '@tanstack/react-router'
import { AdminUsersList } from '../../../feature/Users/UsersList'

export const Route = createFileRoute('/_authenticated/users/admin')({
  component: AdminUsersList,
})
