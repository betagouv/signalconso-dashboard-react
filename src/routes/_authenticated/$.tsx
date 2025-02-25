import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/$')({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: '/suivi-des-signalements',
    })
  },
})
