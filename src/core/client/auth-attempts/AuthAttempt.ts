export interface AuthAttempt {
  id: string
  login: string
  timestamp: string
  isSuccess?: boolean
  failureCause?: string
}
