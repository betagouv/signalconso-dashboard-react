import { Checkbox, Chip, Theme } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import React, { useEffect } from 'react'
import { Txt } from '../../alexlibs/mui-extension'
import { useSetState } from '../../alexlibs/react-hooks-lib'
import { Engagement } from '../../core/client/engagement/Engagement'
import { useApiContext } from '../../core/context/ApiContext'
import { openInNew, textOverflowMiddleCropping } from '../../core/helper'
import { useI18n } from '../../core/i18n'
import { Id } from '../../core/model'
import {
  ListEngagementsQueryKeys,
  useListEngagementsQuery,
} from '../../core/queryhooks/engagementQueryHooks'
import { Datatable } from '../../shared/Datatable/Datatable'
import { Page, PageTitle } from '../../shared/Page'

export const Engagements = () => {
  const { m, formatDate } = useI18n()
  const history = useNavigate()

  const { api } = useApiContext()
  const queryClient = useQueryClient()
  const _check = useMutation({
    mutationFn: (params: { engagementId: Id }) =>
      api.secured.engagement.check(params.engagementId),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ListEngagementsQueryKeys,
      })
    },
  })

  const _uncheck = useMutation({
    mutationFn: (params: { engagementId: Id }) =>
      api.secured.engagement.uncheck(params.engagementId),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ListEngagementsQueryKeys,
      })
    },
  })

  const _engagements = useListEngagementsQuery()
  const selectReport = useSetState<Id>()

  useEffect(() => {
    if (_engagements.data) {
      selectReport.add(
        _engagements.data
          .filter((engagement) => !!engagement.resolutionDate)
          .map((engagement) => engagement.id),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, _engagements.data)

  const goToReport = (
    _: Engagement,
    e: React.MouseEvent<HTMLTableCellElement>,
  ) => {
    if (e.metaKey || e.ctrlKey) {
      openInNew(`/suivi-des-signalements/report/${_.report.id}`)
    } else {
      history({
        to: '/suivi-des-signalements/report/$reportId',
        params: { reportId: _.report.id },
      })
    }
  }

  const nowAsString = new Date().toDateString()
  const now = new Date(nowAsString)
  const nowPlusTwoDays = new Date(nowAsString)
  nowPlusTwoDays.setDate(nowPlusTwoDays.getDate() + 2)

  const rowSx = (_: Engagement) => {
    return {
      '&:hover': {
        background: (t: Theme) =>
          _.resolutionDate ? undefined : t.palette.action.hover,
      },
      fontStyle: _.expirationDate < now || _.resolutionDate ? 'italic' : '',
      background: _.resolutionDate
        ? `
      repeating-linear-gradient(
  -45deg,
  #ffffff,
  #ffffff 4px,
  #e5e7eb 4px,
  #e5e7eb 6px
)
      `
        : undefined,
    }
  }

  const select = (engagement: Engagement) => {
    selectReport.toggle(engagement.id)
    if (selectReport.has(engagement.id))
      return _check.mutate({ engagementId: engagement.id })
    else return _uncheck.mutate({ engagementId: engagement.id })
  }

  const data = _engagements.data?.sort((a, b) => {
    if (a.resolutionDate && !b.resolutionDate) return 1
    else if (!a.resolutionDate && b.resolutionDate) return -1
    else return a.expirationDate.valueOf() - b.expirationDate.valueOf()
  })

  return (
    <Page>
      <PageTitle>Suivi de mes engagements</PageTitle>
      <Datatable<Engagement>
        superheader={
          <p className="">
            Outil optionnel pour vous aider à gérer et suivre vos engagements.
            <span className="block text-gray-500 italic">
              La case à cocher permet de marquer un engagement comme
              "honoré/terminé". Les engagements terminés disparaissent le
              lendemain de leur clôture. Vous pouvez clore et rouvrir un
              engagement autant que vous le souhaitez tant qu'il n'a pas
              disparu.
              <br />
              <br />
              La date d'avis consommateur est indiquée en{' '}
              <Txt bold color="warning">
                orange
              </Txt>{' '}
              2 jours avant son échéance, puis en{' '}
              <Txt bold color="error">
                rouge
              </Txt>{' '}
              lorsque l'avis a été demandé. Si vous cliquez sur la ligne de
              l'engagement, cela ouvre le signalement correspondant.
            </span>
          </p>
        }
        loading={_engagements.isLoading}
        id="engagements"
        rowSx={rowSx}
        total={_engagements.data?.length ?? 0}
        data={data}
        columns={[
          {
            id: 'checkbox',
            head: 'Terminer',
            render: (_) => (
              <Checkbox
                slotProps={{
                  input: {
                    'aria-label': selectReport.has(_.id)
                      ? 'Marquer comme non terminé'
                      : 'Marquer comme terminé',
                  },
                }}
                checked={selectReport.has(_.id)}
                onChange={() => select(_)}
              />
            ),
          },
          {
            id: 'consumer',
            head: 'Consommateur',
            onClick: goToReport,
            render: (_) => (
              <>
                <span>
                  {textOverflowMiddleCropping(_.report.email ?? '', 25)}
                </span>
                <br />
                <Txt color="hint" size="small">
                  {_.report.consumerPhone ?? ''}
                </Txt>
              </>
            ),
          },
          {
            id: 'engagement',
            head: 'Engagement',
            onClick: goToReport,
            render: (_) => (
              <Txt truncate maxWidth="500px" block>
                {_.otherEngagement
                  ? _.otherEngagement
                  : m.responseDetails[_.engagement]}
              </Txt>
            ),
          },
          {
            id: 'echeance',
            head: `Date d'avis consommateur`,
            onClick: goToReport,
            render: (_) => {
              if (_.expirationDate < now)
                return (
                  <Chip label={formatDate(_.expirationDate)} color="error" />
                )
              else if (_.expirationDate <= nowPlusTwoDays)
                return (
                  <Chip label={formatDate(_.expirationDate)} color="warning" />
                )
              else
                return (
                  <Chip
                    label={formatDate(_.expirationDate)}
                    color="primary"
                    variant="outlined"
                  />
                )
            },
          },
        ]}
      />
    </Page>
  )
}
