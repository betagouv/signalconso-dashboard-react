export type ValidationRejectReason = 'TOO_MANY_ATTEMPTS' | 'INVALID_CODE'

export interface TokenInfo {
  token: string
  kind: unknown
  emailedTo: string
}
