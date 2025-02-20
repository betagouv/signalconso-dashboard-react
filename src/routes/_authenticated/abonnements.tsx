import { createFileRoute } from '@tanstack/react-router'
import {Subscriptions} from "../../feature/Subscriptions/Subscriptions";

export const Route = createFileRoute('/_authenticated/abonnements')({
  component: Subscriptions,
})
