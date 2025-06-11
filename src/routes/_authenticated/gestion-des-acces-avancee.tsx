import { createFileRoute } from '@tanstack/react-router'
import { AccessesManagementPro } from 'feature/Users/usersProMassManage/UsersProMassManage'

export const Route = createFileRoute(
  '/_authenticated/gestion-des-acces-avancee',
)({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Gestion des accès avancée' }],
  }),
  component: AccessesManagementPro,
})
