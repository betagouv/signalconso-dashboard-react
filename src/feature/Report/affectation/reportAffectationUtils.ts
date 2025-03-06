import { User } from 'core/model'

import { MinimalUser } from 'core/model'

export function buildAffectationOptionFromUser(user: MinimalUser) {
  return {
    id: user.id,
    fullName: User.buildFullName(user),
  }
}
