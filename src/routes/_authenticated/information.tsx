import { createFileRoute } from '@tanstack/react-router'
import { JoinNewsletter } from '../../feature/JoinNewsletter/JoinNewsletter'

export const Route = createFileRoute('/_authenticated/information')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Informations' }],
  }),
  component: JoinNewsletter,
})
