import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {useI18n} from '../../core/i18n'
import React, {useCallback, useEffect} from 'react'
import {Icon, InputBase} from '@mui/material'
import {Txt} from '../../alexlibs/mui-extension'
import {useToast} from '../../core/toast'
import {DebouncedInput} from '../../shared/DebouncedInput'
import {useEffectFn} from '../../alexlibs/react-hooks-lib'
import {useUsersContext} from '../../core/context/UsersContext'
import {useLocation} from 'react-router'

export const UserAuthAttempts = () => {
  const {m} = useI18n()
  const authAttempts = useUsersContext().authAttempts
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const emailQueryParam = queryParams.get('email')
  const {toastError} = useToast()
  const {formatDateTime} = useI18n()

  useEffect(() => {
    authAttempts.updateFilters(prev => ({...prev, login: emailQueryParam ?? ''}))
  }, [emailQueryParam])

  useEffectFn(authAttempts.error, toastError)

  const onEmailChange = useCallback((email: string) => {
    authAttempts.updateFilters(prev => ({...prev, login: email}))
    // TRELLO-1391 The object authAttempts change all the time.
    // If we put it in dependencies, it causes problems with the debounce,
    // and the search input "stutters" when typing fast
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Panel>
      <Datatable
        id="userslist"
        header={
          <>
            <DebouncedInput value={emailQueryParam || authAttempts.filters.login || ''} onChange={onEmailChange}>
              {(value, onChange) => (
                <InputBase
                  value={value}
                  placeholder={m.searchByEmail + '...'}
                  fullWidth
                  sx={{ml: 1}}
                  onChange={e => onChange(e.target.value)}
                />
              )}
            </DebouncedInput>
          </>
        }
        loading={authAttempts.fetching}
        total={authAttempts.list?.totalCount}
        paginate={{
          limit: authAttempts.filters.limit,
          offset: authAttempts.filters.offset,
          onPaginationChange: pagination => authAttempts.updateFilters(prev => ({...prev, ...pagination})),
        }}
        showColumnsToggle
        rowsPerPageOptions={[5, 10, 25, 100]}
        getRenderRowKey={_ => _.timestamp}
        data={authAttempts.list?.entities}
        columns={[
          {
            id: '',
            head: m.email,
            render: _ => <Txt bold>{_.login}</Txt>,
          },
          {
            head: m.date,
            id: 'date',
            render: _ => formatDateTime(new Date(_.timestamp)),
          },
          {
            head: m.success,
            id: 'isSuccess',
            render: _ =>
              _.isSuccess ? (
                <Icon sx={{color: t => t.palette.success.light}}>check_circle</Icon>
              ) : (
                <Icon sx={{color: t => t.palette.error.main}}>error</Icon>
              ),
          },
          {
            head: m.failureCause,
            id: 'failureCause',
            render: _ => _.failureCause,
          },
        ]}
      />
    </Panel>
  )
}