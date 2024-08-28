import { Box, Icon, Tooltip } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { ScInput } from 'shared/ScInput'
import { IconBtn, Txt } from '../../alexlibs/mui-extension'
import {
  ConsumerEmailValidation,
  EmailValidationStatus,
} from '../../core/client/consumer-email-validation/ConsumerEmailValidation'
import { useApiContext } from '../../core/context/ApiContext'
import { useI18n } from '../../core/i18n'
import { useConsumerEmailValidationSearchQuery } from '../../core/queryhooks/consumerEmailValidationQueryHooks'
import { sxUtils } from '../../core/theme'
import { Datatable } from '../../shared/Datatable/Datatable'
import { DebouncedInput } from '../../shared/DebouncedInput'
import { TrueFalseUndefined } from '../../shared/TrueFalseUndefined'
import { Matomo } from '../../core/plugins/Matomo'

export const ConsumerListPending = () => {
  const { m, formatDate } = useI18n()
  const _users = useConsumerEmailValidationSearchQuery()

  const onEmailChange = useCallback((email: string) => {
    _users.updateFilters((prev) => ({ ...prev, email }))
    // TRELLO-1391 The object _users change all the time.
    // If we put it in dependencies, it causes problems with the debounce,
    // and the search input "stutters" when typing fast
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Datatable
        id="userslist"
        superheader={
          <>
            <p>
              Lors que les consommateurs soumettent un signalement, ils doivent
              entrer un code pour valider leur email. Cette page liste les
              consommateurs qui sont en train d'essayer de valider leur email,
              ou qui ont réussi.
            </p>
          </>
        }
        headerMain={
          <>
            <DebouncedInput
              value={_users.filters.email ?? ''}
              onChange={onEmailChange}
            >
              {(value, onChange) => (
                <ScInput
                  value={value}
                  placeholder={m.searchByEmail + '...'}
                  fullWidth
                  onChange={(e) => onChange(e.target.value)}
                />
              )}
            </DebouncedInput>
          </>
        }
        actions={
          <TrueFalseUndefined
            value={_users.filters.validated}
            onChange={(_) =>
              _users.updateFilters((prev) => ({ ...prev, validated: _ }))
            }
            label={{
              true: m.validated,
              false: m.invalid,
              undefined: m.all,
            }}
          />
        }
        headerMarginBottom
        loading={_users.result.isFetching}
        total={_users.result.data?.totalCount}
        paginate={{
          limit: _users.filters.limit,
          offset: _users.filters.offset,
          onPaginationChange: (pagination) =>
            _users.updateFilters((prev) => ({ ...prev, ...pagination })),
        }}
        showColumnsToggle
        getRenderRowKey={(_) => _.email}
        data={_users.result.data?.entities}
        columns={[
          {
            id: '',
            head: m.email,
            render: (_) => <Txt bold>{_.email}</Txt>,
          },
          {
            head: m.creationDate,
            id: 'creationDate',
            render: (_) => formatDate(_.creationDate),
          },
          {
            head: m.lastAttempt,
            id: 'lastAttempt',
            render: (_) => formatDate(_.lastAttempt),
          },
          {
            head: m.nbAttempts,
            id: 'attempts',
            render: (_) => _.attempts,
          },
          {
            id: 'actions',
            head: '',
            sx: (_) => sxUtils.tdActions,
            render: (_) => <Action consumerEmailValidation={_} />,
          },
        ]}
      />
    </>
  )
}

const Action = (props: {
  consumerEmailValidation: ConsumerEmailValidation
}) => {
  const { m } = useI18n()
  const { consumerEmailValidation: _ } = props
  const { api } = useApiContext()

  const _validate = useMutation({
    mutationFn: () => api.secured.consumerEmailValidation.validate(_.email),
    onSuccess: (data) => {
      data.valid
        ? setStatus(EmailValidationStatus.Valid)
        : setStatus(_.validationStatus)
    },
  })

  const [status, setStatus] = useState(_.validationStatus)

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      {!_validate.isError ? (
        <Tooltip
          title={m.emailValidationStatusTooltipDesc[status]}
          placement="left"
        >
          <span>
            <IconBtn
              disabled={status === EmailValidationStatus.Valid}
              color={'primary'}
              loading={_validate.isPending}
              onClick={() => _validate.mutate()}
            >
              {status === EmailValidationStatus.Valid ? (
                <Icon sx={{ color: (t) => t.palette.success.light }}>
                  check_circle
                </Icon>
              ) : (
                <Icon
                  sx={{
                    color: (t) =>
                      status === EmailValidationStatus.Expired
                        ? t.palette.warning.light
                        : t.palette.primary.light,
                  }}
                >
                  task_alt
                </Icon>
              )}
            </IconBtn>
          </span>
        </Tooltip>
      ) : (
        <></>
      )}
    </Box>
  )
}
