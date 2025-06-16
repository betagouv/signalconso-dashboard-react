import { createFileRoute } from '@tanstack/react-router'
import { AdminUsersList } from '../../../feature/Users/UsersList'

export const Route = createFileRoute('/_authenticated/users/admin')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Administrateurs' }],
  }),
  component: AdminUsersList,
})
