import {Page, PageTitle} from '../../shared/Page'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Id} from '../../core/model'
import {Box, Chip, Theme} from '@mui/material'
import {openInNew, textOverflowMiddleCropping} from '../../core/helper'
import {Txt, useToast} from '../../alexlibs/mui-extension'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {siteMap} from '../../core/siteMap'
import {useNavigate} from 'react-router'
import {ListPromisesOfActionQueryKeys, useListPromisesOfActionQuery} from '../../core/queryhooks/promiseQueryHooks'
import {PromiseOfAction} from '../../core/client/promise/PromiseOfAction'
import {useApiContext} from '../../core/context/ApiContext'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {DelayedCheckbox} from './DelayedCheckbox'

export const PromisesOfAction = () => {
  const {m, formatDate} = useI18n()
  const history = useNavigate()

  const {toastSuccess} = useToast()
  const {api} = useApiContext()
  const queryClient = useQueryClient()
  const _honour = useMutation({
    mutationFn: (params: {promiseId: Id}) => api.secured.promise.honour(params.promiseId),
    onSuccess: () => {
      toastSuccess('Promesse honorée !')
      return queryClient.invalidateQueries({queryKey: ListPromisesOfActionQueryKeys})
    },
  })

  const _promises = useListPromisesOfActionQuery()

  const test = (_: PromiseOfAction, e: React.MouseEvent<HTMLTableCellElement>) => {
    if (e.metaKey || e.ctrlKey) {
      openInNew(siteMap.logged.report(_.report.id))
    } else {
      history(siteMap.logged.report(_.report.id))
    }
  }

  const nowAsString = new Date().toDateString()
  const now = new Date(nowAsString)
  const nowPlusTwoDays = new Date(nowAsString)
  nowPlusTwoDays.setDate(nowPlusTwoDays.getDate() + 2)

  const rowSx = (_: PromiseOfAction) => {
    return {
      '&:hover': {
        background: (t: Theme) => t.palette.action.hover,
      },
      fontStyle: _.expirationDate < now ? 'italic' : '',
    }
  }

  return (
    <Page>
      <PageTitle>Suivi des promesses d'action</PageTitle>
      <Datatable<PromiseOfAction>
        loading={_promises.isLoading}
        id="promises"
        rowSx={rowSx}
        total={_promises.data?.length ?? 0}
        data={_promises.data}
        columns={[
          {
            id: 'checkbox',
            head: 'Terminer',
            render: _ => <DelayedCheckbox delayedAction={() => _honour.mutate({promiseId: _.id})} />,
          },
          {
            id: 'consumer',
            head: 'Consommateur',
            onClick: test,
            render: _ => (
              <span>
                <Box component="span">{textOverflowMiddleCropping(_.report.email ?? '', 25)}</Box>
                <br />
                <Txt color="hint" size="small">
                  {_.report.consumerPhone ?? ''}
                </Txt>
              </span>
            ),
          },
          {
            id: 'engagement',
            head: 'Engagement',
            onClick: test,
            render: _ => (
              <Txt truncate maxWidth="500px" block>
                {_.otherEngagement ? _.otherEngagement : m.responseDetails[_.engagement]}
              </Txt>
            ),
          },
          {
            id: 'echeance',
            head: `Date d'échéance`,
            onClick: test,
            render: _ => {
              if (_.expirationDate < now) return <Chip label={formatDate(_.expirationDate)} color="error" />
              else if (_.expirationDate <= nowPlusTwoDays) return <Chip label={formatDate(_.expirationDate)} color="warning" />
              else return <Chip label={formatDate(_.expirationDate)} color="primary" variant="outlined" />
            },
          },
        ]}
      />
    </Page>
  )
}
