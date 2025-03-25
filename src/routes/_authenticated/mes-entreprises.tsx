import { createFileRoute } from '@tanstack/react-router'
import { CompaniesProLegacy } from '../../feature/CompaniesPro/CompaniesProLegacy'

export const Route = createFileRoute('/_authenticated/mes-entreprises')({
  component: CompaniesProLegacy,
})
