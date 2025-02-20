import { createFileRoute } from '@tanstack/react-router'
import {CompaniesRegistered} from "../../../feature/Companies/CompaniesRegistered";

export const Route = createFileRoute(
  '/_authenticated/entreprises/les-plus-signalees',
)({
  component: CompaniesRegistered,
})
