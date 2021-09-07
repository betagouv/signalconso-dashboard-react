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
import {useParams} from 'react-router'
import {Id} from '../../core/api'
import {useAsync} from '@alexandreannic/react-hooks-lib'
import {makeStyles} from '@material-ui/core/styles'
import {Theme} from '@material-ui/core'
import {HelpContactInfo} from '../../shared/HelpContactInfo/HelpContactInfo'
import {AuthenticationEventActions, EventCategories, Matomo} from '../../core/analyics/Matomo'
import {useToast} from '../../core/toast'
import {fnSwitch} from '../../core/helper/utils'

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
      <Page size="small" className={css.page}>
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
            <PanelFoot alignEnd border>
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
