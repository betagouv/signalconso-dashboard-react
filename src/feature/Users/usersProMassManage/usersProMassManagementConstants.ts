export const massManageOperations = ['Remove', 'SetMember', 'SetAdmin'] as const
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
