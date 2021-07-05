export interface User {
  email: string
  firstName: string
  lastName: string
  lastEmailValidation: Date
}


export interface UserPending {
  email: string
  tokenCreation: Date
  tokenExpiration: Date
}
