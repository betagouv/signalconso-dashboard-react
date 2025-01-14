import { Icon } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiContext } from 'core/context/ApiContext'
import { useConnectedContext } from 'core/context/ConnectedContext'
import { Paginate, ReportSearchResult } from 'core/model'
import {
  EventCategories,
  SignalementsActions,
  trackEvent,
} from 'core/plugins/Matomo'
import {
  GetReportQueryKeys,
  ReportSearchQueryKeyStart,
} from 'core/queryhooks/reportQueryHooks'

export function BookmarkButton({
  isBookmarked,
  reportId,
}: {
  isBookmarked: boolean
  reportId: string
}) {
  const { api } = useApiContext()
  const { connectedUser } = useConnectedContext()
  const queryClient = useQueryClient()
  const _setBookmarked = useMutation({
    mutationFn: (bookmarked: boolean) => {
      return api.secured.reports.setBookmarked({ reportId, bookmarked })
    },
    onSuccess: (_, bookmarked) => {
      queryClient.setQueryData<ReportSearchResult>(
        GetReportQueryKeys(reportId),
        (old) => {
          if (!old) {
            return undefined
          }
          return {
            ...old,
            isBookmarked: bookmarked,
          }
        },
      )
      queryClient.setQueriesData<Paginate<ReportSearchResult>>(
        { queryKey: ReportSearchQueryKeyStart },
        (old) => {
          if (!old) {
            return undefined
          }
          return {
            ...old,
            entities: old.entities.map((x) => ({
              ...x,
              ...(x.report.id === reportId
                ? { isBookmarked: bookmarked }
                : null),
            })),
          }
        },
      )
      queryClient.invalidateQueries({
        queryKey: BookmarksCountQueryKey,
      })
    },
  })

  const label = isBookmarked
    ? `Supprimer des marque-pages`
    : `Ajouter aux marque-pages`
  return (
    <button
      onClick={() => {
        if (!isBookmarked) {
          trackEvent(
            connectedUser,
            EventCategories.Signalements,
            SignalementsActions.ajoutMarquePage,
          )
        }
        _setBookmarked.mutate(!isBookmarked)
      }}
      aria-label={label}
      title={label}
    >
      <Icon
        className={`mb-[-5px] ${isBookmarked ? 'text-blue-500' : 'text-gray-700'}`}
      >
        {isBookmarked ? 'bookmark' : 'bookmark_border'}
      </Icon>
    </button>
  )
}

export function BookmarksIcon() {
  return <Icon className={`mb-[-5px] text-blue-500`}>bookmarks</Icon>
}

export const BookmarksCountQueryKey = ['bookmarksCount']
