import {Id, PaginatedSearch, ValidationRejectReason} from '../../model'

export interface ConsumerEmailValidation {
  id: Id
  creationDate: Date
  confirmationCode: string
  email: string
  attempts: number
  lastAttempt?: Date
  lastValidationDate?: Date
  isValid: Boolean
}

export interface ConsumerEmailValidationSearch extends PaginatedSearch {
  email?: string
  validated?: boolean
}

export interface ConsumerEmailResult {
  valid: boolean
  reason?: ValidationRejectReason
}
