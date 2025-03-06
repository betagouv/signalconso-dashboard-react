import { createRouter } from '@tanstack/react-router'
import qs from 'qs'
import { queryClient } from 'queryClient'
import { routeTree } from './routeTree.gen'
import './style.css'

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    // auth will initially be undefined
    // We'll be passing down the auth state from within a React component
    loginManagementResult: undefined!,
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  // Legacy parsing / stringify
  // Because of potential bookmarks / links in emails, we can't use native JSON tanstack router parsing
  stringifySearch: (record) => {
    const newQueryString = qs.stringify(record)
    return newQueryString ? `?${newQueryString}` : ''
  },
  parseSearch: (searchStr) => {
    // arrayLimit raised from 20 to 200 otherwise the departments list may not be parsed correctly
    return qs.parse(searchStr.replace(/^\?/, ''), {
      arrayLimit: 200,
    })
  },
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
