import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/stats/$')({
  beforeLoad: ({context}) => {
    if (context.loginManagementResult.connectedUser?.role === 'DGAL') {
      throw redirect({
        to: '/stats/pro-stats'
      })
    } else {
      throw redirect({
        to: '/stats/report-stats'
      })
    }
  }
})
