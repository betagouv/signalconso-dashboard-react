import { createFileRoute } from '@tanstack/react-router'
import {JoinNewsletter} from "../../feature/JoinNewsletter/JoinNewsletter";

export const Route = createFileRoute('/_authenticated/information')({
  component: JoinNewsletter,
})