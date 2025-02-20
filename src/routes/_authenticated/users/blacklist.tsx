import { createFileRoute } from '@tanstack/react-router'
import {ConsumerBlacklist} from "../../../feature/Users/ConsumerBlacklist";

export const Route = createFileRoute('/_authenticated/users/blacklist')({
  component: ConsumerBlacklist,
})