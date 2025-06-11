import { createFileRoute } from '@tanstack/react-router'
import { ConsumerBlacklist } from '../../../feature/Users/ConsumerBlacklist'

export const Route = createFileRoute('/_authenticated/users/blacklist')({
  head: () => ({
    meta: [
      { title: 'Espace pro Signal Conso : Liste noire des consommateurs' },
    ],
  }),
  component: ConsumerBlacklist,
})
