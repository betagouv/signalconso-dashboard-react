import { UserUtils } from 'core/client/user/User'
import { MinimalUser } from 'core/model'

export function buildAffectationOptionFromUser(user: MinimalUser) {
  return {
    id: user.id,
    fullName: UserUtils.buildFullName(user),
  }
}
