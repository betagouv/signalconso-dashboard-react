import { User } from 'core/model'

export const massManageOperations = ['Remove', 'SetMember', 'SetAdmin'] as const
export type MassManageOperation = (typeof massManageOperations)[number]
export type MassManageInputs = {
  operation: MassManageOperation | null
  companiesIds: string[]
  users: {
    usersIds: string[]
    alreadyInvitedEmails: string[]
    emailsToInvite: string[]
  }
}
export type MassManagementUsers = {
  users: User[]
  invitedEmails: string[]
}
