import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/entreprises/$')({
  beforeLoad: () => {
    throw redirect({
      to: '/entreprises/les-plus-signalees',
      search: { offset: 0, limit: 25 },
    })
  },
})
