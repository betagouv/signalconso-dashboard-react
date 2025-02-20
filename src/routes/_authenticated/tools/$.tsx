import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tools/$')({
  beforeLoad: () => {
    throw redirect({
      to: '/tools/test'
    })
  }
})
