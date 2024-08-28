import { Icon } from '@mui/material'
import { useCallback } from 'react'
import { useLocation } from 'react-router'
import { ScInput } from 'shared/ScInput'
import { Txt } from '../../alexlibs/mui-extension'
import { useI18n } from '../../core/i18n'
import { useSearchAuthAttemptsQuery } from '../../core/queryhooks/userQueryHooks'
import { Datatable } from '../../shared/Datatable/Datatable'
import { DebouncedInput } from '../../shared/DebouncedInput'

export const UserAuthAttempts = () => {
  const { m } = useI18n()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const emailQueryParam = queryParams.get('email')
  const { formatDateTime } = useI18n()
  const authAttempts = useSearchAuthAttemptsQuery({
    limit: 25,
    offset: 0,
    login: emailQueryParam ?? '',
  })

  const onEmailChange = useCallback((email: string) => {
    authAttempts.updateFilters((prev) => ({ ...prev, login: email }))
    // TRELLO-1391 The object authAttempts change all the time.
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
              Chaque fois que quelqu'un se connecte à l'Espace Pro avec un
              login/mot de passe, ou essaie de le faire, il apparait dans cette
              page.
            </p>
            <p className="text-gray-500 italic">
              Cette liste peut afficher des emails erronés, qui ne correspondent
              pas à un compte. Si l'utilisateur se trompe dans l'orthographe de
              son email, cette tentative de connexion apparaitra dans la liste.
            </p>
          </>
        }
        headerMain={
          <>
            <DebouncedInput
              value={emailQueryParam || authAttempts.filters.login || ''}
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
        headerMarginBottom
        loading={authAttempts.result.isFetching}
        total={authAttempts.result.data?.totalCount}
        paginate={{
          limit: authAttempts.filters.limit,
          offset: authAttempts.filters.offset,
          onPaginationChange: (pagination) =>
            authAttempts.updateFilters((prev) => ({ ...prev, ...pagination })),
        }}
        showColumnsToggle
        getRenderRowKey={(_) => _.timestamp}
        data={authAttempts.result.data?.entities}
        columns={[
          {
            id: '',
            head: m.email,
            render: (_) => <Txt bold>{_.login}</Txt>,
          },
          {
            head: m.date,
            id: 'date',
            render: (_) => formatDateTime(new Date(_.timestamp)),
          },
          {
            head: m.success,
            id: 'isSuccess',
            render: (_) =>
              _.isSuccess ? (
                <Icon sx={{ color: (t) => t.palette.success.light }}>
                  check_circle
                </Icon>
              ) : (
                <Icon sx={{ color: (t) => t.palette.error.main }}>error</Icon>
              ),
          },
          {
            head: m.failureCause,
            id: 'failureCause',
            render: (_) => _.failureCause,
          },
        ]}
      />
    </>
  )
}
