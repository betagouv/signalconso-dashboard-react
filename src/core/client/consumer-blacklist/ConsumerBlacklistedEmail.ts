import { Id } from '../../model'

export interface ConsumerBlacklistedEmail {
  id: Id
  creationDate: Date
  email: string
  comments?: string
}

export interface ConsumerBlacklistedEmailRawFromApi {
  id: Id
  creationDate: string
  email: string
  comments?: string
}
