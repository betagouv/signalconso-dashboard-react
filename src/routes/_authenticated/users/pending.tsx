import { createFileRoute } from '@tanstack/react-router'
import {UsersAgentListPending} from "../../../feature/Users/UsersAgentListPending";

export const Route = createFileRoute('/_authenticated/users/pending')({
  component: UsersAgentListPending,
})
