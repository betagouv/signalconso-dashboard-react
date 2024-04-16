import {Page, PageTitle} from '../../shared/Page'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Id} from '../../core/model'
import {Box, Checkbox, Chip, Theme} from '@mui/material'
import {openInNew, textOverflowMiddleCropping} from '../../core/helper'
import {Txt, useToast} from '../../alexlibs/mui-extension'
import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {siteMap} from '../../core/siteMap'
import {useNavigate} from 'react-router'
import {ListPromisesOfActionQueryKeys, useListPromisesOfActionQuery} from '../../core/queryhooks/promiseQueryHooks'
import {PromiseOfAction} from '../../core/client/promise/PromiseOfAction'
import {useApiContext} from '../../core/context/ApiContext'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useSetState} from '../../alexlibs/react-hooks-lib'

export const PromisesOfAction = () => {
  const {m, formatDate} = useI18n()
  const history = useNavigate()

  const {toastSuccess} = useToast()
  const {api} = useApiContext()
  const queryClient = useQueryClient()
  const _check = useMutation({
    mutationFn: (params: {promiseId: Id}) => api.secured.promise.check(params.promiseId),
    onSuccess: () => {
      toastSuccess('Promesse marquée comme terminée !')
      return queryClient.invalidateQueries({queryKey: ListPromisesOfActionQueryKeys})
    },
  })

  const _uncheck = useMutation({
    mutationFn: (params: {promiseId: Id}) => api.secured.promise.uncheck(params.promiseId),
    onSuccess: () => {
      return queryClient.invalidateQueries({queryKey: ListPromisesOfActionQueryKeys})
    },
  })

  const _promises = useListPromisesOfActionQuery()
  const selectReport = useSetState<Id>()

  useEffect(() => {
    if (_promises.data) {
      selectReport.add(_promises.data.filter(promise => !!promise.resolutionDate).map(promise => promise.id))
    }
  }, _promises.data)

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
        background: (t: Theme) => (_.resolutionDate ? undefined : t.palette.action.hover),
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

  const select = (promiseOfAction: PromiseOfAction) => {
    selectReport.toggle(promiseOfAction.id)
    if (selectReport.has(promiseOfAction.id)) return _check.mutate({promiseId: promiseOfAction.id})
    else return _uncheck.mutate({promiseId: promiseOfAction.id})
  }

  const data = _promises.data?.sort((a, b) => {
    if (a.resolutionDate && !b.resolutionDate) return 1
    else if (!a.resolutionDate && b.resolutionDate) return -1
    else return a.expirationDate.valueOf() - b.expirationDate.valueOf()
  })

  return (
    <Page>
      <PageTitle>Suivi des promesses d'action</PageTitle>
      <Datatable<PromiseOfAction>
        superheader={
          <p className="">
            Outil optionnel pour vous aider à gérer et suivre vos promesses d'action.
            <span className="block text-gray-500 italic">
              La case à cocher permet de marquer une promesse comme "honorée/terminée". Les promesses terminées disparaissent le
              lendemain de leur cloture. Vous pouvez clore et ré-ouvrir une promesse autant que vous le souhaitez tant qu'elle n'a
              pas disparue.
              <br />
              La date d'avis consommateur est indiquée en{' '}
              <Txt bold color="warning">
                orange
              </Txt>{' '}
              2 jours avant son échéance, puis en{' '}
              <Txt bold color="error">
                rouge
              </Txt>{' '}
              lorsque l'avis a été demandé. Si vous cliquez sur la promesse, cela ouvre le signalement correspondant.
            </span>
          </p>
        }
        loading={_promises.isLoading}
        id="promises"
        rowSx={rowSx}
        total={_promises.data?.length ?? 0}
        data={data}
        columns={[
          {
            id: 'checkbox',
            head: 'Terminer',
            render: _ => <Checkbox checked={selectReport.has(_.id)} onChange={() => select(_)} />,
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
            head: `Date d'avis consommateur`,
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
