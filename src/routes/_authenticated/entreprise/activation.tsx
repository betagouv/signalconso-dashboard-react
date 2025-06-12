import { createFileRoute } from '@tanstack/react-router'
import { AddCompanyForm } from '../../../feature/AddCompany/AddCompanyForm'

export const Route = createFileRoute('/_authenticated/entreprise/activation')({
  head: () => ({
    meta: [{ title: "Espace pro Signal Conso : Activation d'une entreprise" }],
  }),
  component: AddCompanyForm,
})
