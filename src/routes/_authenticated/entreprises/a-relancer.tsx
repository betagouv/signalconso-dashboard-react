import { createFileRoute } from '@tanstack/react-router'
import {CompaniesToFollowUp} from "../../../feature/Companies/CompaniesToFollowUp";

export const Route = createFileRoute('/_authenticated/entreprises/a-relancer')({
  component: CompaniesToFollowUp,
})
