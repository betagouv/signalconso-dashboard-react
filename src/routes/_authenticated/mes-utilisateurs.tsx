import { createFileRoute } from '@tanstack/react-router'
import { UsersPro } from '../../feature/Users/UsersPro'

export const Route = createFileRoute('/_authenticated/mes-utilisateurs')({
  component: UsersPro,
})
