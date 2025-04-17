import { createFileRoute } from '@tanstack/react-router'
import { AccessesManagementPro } from 'feature/Users/usersProMassManage/UsersProMassManage'

export const Route = createFileRoute('/_authenticated/gestion-des-acces')({
  component: AccessesManagementPro,
})
