import { createFileRoute } from '@tanstack/react-router'
import {UserAuthAttempts} from "../../../feature/Users/UserAuthAttempts";

type AuthAttemptsSearch = {
  email: string | null
}

export const Route = createFileRoute('/_authenticated/users/auth-attempts')({
  component: UserAuthAttempts,
  validateSearch: (search: Record<string, unknown>): AuthAttemptsSearch => {
    return {
      email: search.email as string ?? null
    }
  }
})
