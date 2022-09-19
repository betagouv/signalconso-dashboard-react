import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import React from 'react'
import {PageTab, PageTabs} from '../../shared/Layout/Page/PageTabs'
import {siteMap} from '../../core/siteMap'
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {UsersList} from './UsersList'
import {UsersListPending} from './UsersListPending'
import {ScButton} from '../../shared/Button/Button'
import {Alert} from '../../alexlibs/mui-extension'
import {ScInput} from '../../shared/Input/ScInput'
import {useForm} from 'react-hook-form'
import {Txt} from '../../alexlibs/mui-extension'
import {useUsersContext} from '../../core/context/UsersContext'
import {regexp} from '../../core/helper/regexp'
import {useToast} from '../../core/toast'

import {ScDialog} from '../../shared/Confirm/ScDialog'
import {ConsumerListPending} from './ConsumerListPending'
import {ScOption} from 'core/helper/ScOption'
import {Box, DialogContent} from '@mui/material'

const InvitationDialog = ({kind}: {kind: 'admin' | 'dgccrf'}) => {
  const {m} = useI18n()
  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<{email: string}>({mode: 'onChange'})
  const _invite = useUsersContext().invite
  const {toastSuccess} = useToast()

  const buttonLabel = kind === 'admin' ? m.invite_admin : m.invite_dgccrf
  const dialogTitle = kind === 'admin' ? m.users_invite_dialog_title_admin : m.users_invite_dialog_title_dgcrrf
  // TODO séparer le warning, le mettre dans un vrai warning
  const dialogDesc = kind === 'admin' ? m.users_invite_dialog_desc_admin : m.users_invite_dialog_desc_dgccrf
  // TODO faire varier ça
  const emailRegexp = regexp.emailDGCCRF
  const emailValidationMessage = m.emailDGCCRFValidation

  return (
    <ScDialog
      maxWidth="xs"
      onConfirm={(event, close) => {
        handleSubmit(({email}) => {
          _invite
            .fetch({}, email)
            .then(() => toastSuccess(m.userInvitationSent))
            .then(close)
        })()
      }}
      confirmLabel={m.invite}
      loading={_invite.loading}
      confirmDisabled={!isValid}
      title={dialogTitle}
      content={
        <>
          {ScOption.from(_invite.error?.details?.id)
            .map(errId => (
              <Alert dense type="error" deletable gutterBottom>
                {m.apiErrorsCode[errId as keyof typeof m.apiErrorsCode]}
              </Alert>
            ))
            .toUndefined()}
          <Txt color="hint" block gutterBottom>
            {dialogDesc}
          </Txt>
          <ScInput
            autoFocus
            fullWidth
            label={m.email}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', {
              required: m.required,
              pattern: {
                value: regexp.emailDGCCRF,
                message: m.emailDGCCRFValidation,
              },
            })}
          />
        </>
      }
    >
      <ScButton icon="person_add" variant="contained" color="primary">
        {buttonLabel}
      </ScButton>
    </ScDialog>
  )
}

export const Users = () => {
  const {m} = useI18n()
  const {path} = useRouteMatch()

  return (
    <Page>
      <PageTitle
        action={
          <>
            <Box>
              <InvitationDialog kind="admin" />
            </Box>
            <Box>
              <InvitationDialog kind="dgccrf" />
            </Box>
          </>
        }
      >
        {m.menu_users}
      </PageTitle>
      <PageTabs>
        <PageTab to={siteMap.logged.users_dgccrf_all} label={m.dgccrfUsers} />
        <PageTab to={siteMap.logged.users_dgccrf_pending} label={m.dgccrfUsersPending} />
        <PageTab to={siteMap.logged.users_consumer_validation} label={m.consumersPending} />
      </PageTabs>
      <Switch>
        <Redirect exact from={path} to={siteMap.logged.users_dgccrf_all} />
        <Route path={siteMap.logged.users_dgccrf_all} component={UsersList} />
        <Route path={siteMap.logged.users_dgccrf_pending} component={UsersListPending} />
        <Route path={siteMap.logged.users_consumer_validation} component={ConsumerListPending} />
      </Switch>
    </Page>
  )
}
