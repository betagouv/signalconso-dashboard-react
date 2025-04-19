export const massManageOperations = [
  'remove',
  'set_member',
  'set_admin',
] as const
export type MassManageOperation = (typeof massManageOperations)[number]
export type MassManageChoices = {
  operation: MassManageOperation | null
  companiesIds: string[]
  users: {
    usersIds: string[]
    alreadyInvitedTokenIds: string[]
    emailsToInvite: string[]
  }
}
