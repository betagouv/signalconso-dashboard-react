import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/moderation-url-entreprises/$',
)({
  beforeLoad: ({context}) => {
    if (context.loginManagementResult.connectedUser?.role === 'SuperAdmin' ||
      context.loginManagementResult.connectedUser?.role === 'Admin' ||
      context.loginManagementResult.connectedUser?.role === 'ReadOnlyAdmin') {
      throw redirect({
        to: '/moderation-url-entreprises/enquete'
      })
    } else {
      throw redirect({
        to: '/moderation-url-entreprises/sites-internet/non-identifies'
      })
    }
  }
})
