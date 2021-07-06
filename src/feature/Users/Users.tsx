import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import React from 'react'
import {PageTab, PageTabs} from '../../shared/Layout/Page/PageTabs'
import {siteMap} from '../../core/siteMap'
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {UsersList} from './UsersList'
import {UsersListPending} from './UsersListPending'
import {ScButton} from '../../shared/Button/Button'
import {Confirm} from 'mui-extension/lib'
import {ScInput} from '../../shared/Input/ScInput'
import {useForm} from 'react-hook-form'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useUsersContext} from '../../core/context/UsersContext'
import {regexp} from '../../core/helper/regexp'
import {fromNullable} from 'fp-ts/lib/Option'

export const Users = () => {
  const {m} = useI18n()
  const {path, url} = useRouteMatch()
  const {register, handleSubmit, control, getValues, formState: {errors}} = useForm<{email: string}>()
  const _invite = useUsersContext().invite

  console.log(errors)
  return (
    <Page>
      <PageTitle action={
        <Confirm
          onConfirm={() => fromNullable(getValues().email).map(_invite.fetch())}
          confirmLabel={m.invite}
          cancelLabel={m.close}
          title={m.users_invite_dialog_title}
          content={
            <>
              <Txt color="hint" block gutterBottom>{m.users_invite_dialog_desc}</Txt>
              <ScInput
                fullWidth
                label={m.email}
                error={true}
                helperText="test"
              />
              <ScInput
                fullWidth
                label={m.email}
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: regexp.emailDGCCRF,
                    message: 'Please enter a valid email',
                  }
                })}/>
              <ScButton onClick={handleSubmit(console.log)}>OHO</ScButton>
            </>
          }>
          <ScButton loading={_invite.loading} icon="person_add" variant="contained" color="primary">
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
