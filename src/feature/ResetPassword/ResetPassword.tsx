import {CenteredContent} from '../../shared/CenteredContent/CenteredContent'
import {Page} from '../../shared/Layout'
import {headerHeight} from '../../core/Layout'
import {useForm} from 'react-hook-form'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScInputPassword} from '../../shared/InputPassword/InputPassword'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {ScButton} from '../../shared/Button/Button'
import {useHistory, useParams} from 'react-router'
import {Id} from '@signal-conso/signalconso-api-sdk-js'
import {useAsync} from '@alexandreannic/react-hooks-lib'
import makeStyles from '@mui/styles/makeStyles'
import {Theme} from '@mui/material'
import {HelpContactInfo} from '../../shared/HelpContactInfo/HelpContactInfo'
import {AuthenticationEventActions, EventCategories, Matomo} from '../../core/plugins/Matomo'
import {useToast} from '../../core/toast'
import {fnSwitch} from '../../core/helper/utils'
import {siteMap} from '../../core/siteMap'

interface Form {
  newPassword: string
  newPasswordConfirmation: string
}

interface Props {
  onResetPassword: (password: string, token: Id) => Promise<any>
}

const useStyles = makeStyles((t: Theme) => ({
  page: {
    maxWidth: `500px !important`,
  },
}))

export const ResetPassword = ({onResetPassword}: Props) => {
  const {m} = useI18n()
  const {token} = useParams<{token: Id}>()
  const _resetPassword = useAsync(onResetPassword)
  const css = useStyles()
  const history = useHistory()
  const {toastError, toastSuccess} = useToast()
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: {errors, isValid},
  } = useForm<Form>()

  const resetPassword = (form: Form) => {
    _resetPassword
      .call(form.newPassword, token)
      .then(() => {
        toastSuccess(m.resetPasswordSuccess)
        setTimeout(() => history.push(siteMap.loggedout.login), 400)
        Matomo.trackEvent(EventCategories.account, AuthenticationEventActions.resetPasswordSuccess)
      })
      .catch(err => {
        const errorMessage = fnSwitch(
          err.code,
          {
            404: m.resetPasswordNotFound,
          },
          () => undefined,
        )
        toastError({message: errorMessage})
        reset()
        Matomo.trackEvent(EventCategories.account, AuthenticationEventActions.resetPasswordFail)
      })
  }

  return (
    <CenteredContent offset={headerHeight}>
      <Page size="s" className={css.page}>
        <form onSubmit={handleSubmit(resetPassword)}>
          <Panel>
            <PanelHead>{m.newPassword}</PanelHead>
            <PanelBody>
              <ScInputPassword
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message ?? ' '}
                fullWidth
                label={m.newPassword}
                {...register('newPassword', {
                  required: {value: true, message: m.required},
                  minLength: {value: 8, message: m.passwordNotLongEnough},
                  validate: value => value === getValues().newPasswordConfirmation || m.passwordDoesntMatch,
                })}
              />
              <ScInputPassword
                error={!!errors.newPasswordConfirmation}
                helperText={errors.newPasswordConfirmation?.message ?? ' '}
                fullWidth
                label={m.newPasswordConfirmation}
                {...register('newPasswordConfirmation', {
                  required: {value: true, message: m.required},
                  minLength: {value: 8, message: m.passwordNotLongEnough},
                  validate: value => value === getValues().newPassword || m.passwordDoesntMatch,
                })}
              />
            </PanelBody>
            <PanelFoot alignEnd>
              <ScButton variant="contained" color="primary" type="submit">
                {m.validate}
              </ScButton>
            </PanelFoot>
          </Panel>
          <HelpContactInfo />
        </form>
      </Page>
    </CenteredContent>
  )
}
