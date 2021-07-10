import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import React from 'react'
import {PageTab, PageTabs} from '../../shared/Layout/Page/PageTabs'
import {siteMap} from '../../core/siteMap'
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {UsersList} from './UsersList'
import {UsersListPending} from './UsersListPending'
import {ScButton} from '../../shared/Button/Button'
import {Alert, Confirm} from 'mui-extension/lib'
import {ScInput} from '../../shared/Input/ScInput'
import {useForm} from 'react-hook-form'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useUsersContext} from '../../core/context/UsersContext'
import {regexp} from '../../core/helper/regexp'
import {useToast} from '../../core/toast'
import {fromNullable} from 'fp-ts/lib/Option'

export const Users = () => {
  const {m} = useI18n()
  const {path, url} = useRouteMatch()
  const {register, handleSubmit, formState: {errors, isValid}} = useForm<{email: string}>({mode: 'onChange'})
  const _invite = useUsersContext().invite
  const {toastSuccess} = useToast()

  console.log(errors)
  return (
    <Page>
      <PageTitle action={
        <Confirm
          maxWidth="xs"
          onConfirm={(close) => {
            handleSubmit(({email}) => {
              _invite.fetch()(email)
                .then(() => toastSuccess(m.userInvitationSent))
                .then(close)
            })()
          }}
          confirmLabel={m.invite}
          cancelLabel={m.close}
          loading={_invite.loading}
          confirmDisabled={!isValid}
          title={m.users_invite_dialog_title}
          content={
            <>
              {fromNullable(_invite.error).map(error =>
                <Alert dense type="error" deletable gutterBottom>{m.anErrorOccurred}</Alert>
              ).toUndefined()}
              <Txt color="hint" block gutterBottom>{m.users_invite_dialog_desc}</Txt>
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
                  }
                })}/>
            </>
          }>
          <ScButton
            icon="person_add"
            variant="contained"
            color="primary">
            {m.invite}
          </ScButton>
        </Confirm>
      }>{m.menu_users}</PageTitle>
      <PageTabs>
        <PageTab to={siteMap.users_all} label={m.dgccrfUsers}/>
        <PageTab to={siteMap.users_pending} label={m.pendingInvitation}/>
      </PageTabs>
      <Switch>
        <Redirect exact from={path} to={siteMap.users_all}/>
        <Route path={siteMap.users_all} component={UsersList}/>
        <Route path={siteMap.users_pending} component={UsersListPending}/>
      </Switch>
    </Page>
  )
}
