import {useI18n} from '../../core/i18n'
import {ScInput} from '../../shared/Input/ScInput'
import {useForm} from 'react-hook-form'
import {regexp} from '../../core/helper/regexp'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {LoginPanel} from './LoginPanel'
import {ScButton} from '../../shared/Button/Button'
import makeStyles from '@mui/styles/makeStyles'
import {Theme} from '@mui/material'
import {ActionProps} from './LoginPage'
import {Alert} from 'mui-extension'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import React from 'react'
import {useToast} from '../../core/toast'
import {useHistory} from 'react-router'
import {siteMap} from '../../core/siteMap'
import {ScInputPassword} from '../../shared/InputPassword/InputPassword'
import {AccessEventActions, ActionResultNames, EventCategories, Matomo} from '../../core/plugins/Matomo'
import {ApiDetailedError, ApiError} from '@signal-conso/signalconso-api-sdk-js'

interface Form {
  siret: string
  code: string
  email: string
}

const useStyles = makeStyles((t: Theme) => ({
  foot: {
    marginTop: t.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
}))

interface Props {
  register: ActionProps<(siret: string, code: string, email: string) => Promise<any>>
}

export const ActivateAccountForm = ({register: registerAction}: Props) => {
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const css = useStyles()
  const {toastSuccess, toastApiError} = useToast()
  const history = useHistory()
  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<Form>({mode: 'onSubmit'})

  const activateAccount = (form: Form) => {
    registerAction
      .action(form.siret, form.code, form.email)
      .then(() => {
        toastSuccess(m.companyRegisteredEmailSent)
        setTimeout(() => history.push(siteMap.loggedout.login), 400)
        Matomo.trackEvent(EventCategories.account, AccessEventActions.activateCompanyCode, ActionResultNames.success)
      })
      .catch((err: ApiDetailedError) => {
        toastApiError(err)
        Matomo.trackEvent(EventCategories.companyAccess, AccessEventActions.activateCompanyCode, ActionResultNames.fail)
      })
  }

  return (
    <LoginPanel title={m.youReceivedNewLetter}>
      {registerAction.error && (
        <Alert type="error" className={cssUtils.marginBottom2}>
          <Txt size="big" block bold>
            {m.registerCompanyError}
          </Txt>
          <Txt>{m.registerCompanyErrorDesc}</Txt>
        </Alert>
      )}
      <form onSubmit={handleSubmit(activateAccount)}>
        <ScInput
          className={cssUtils.marginBottom}
          fullWidth
          error={!!errors.siret}
          helperText={errors.siret?.message ?? m.siretOfYourCompanyDesc}
          label={m.siretOfYourCompany}
          {...register('siret', {
            required: {value: true, message: m.required},
            pattern: {value: regexp.siret, message: m.siretOfYourCompanyInvalid},
          })}
        />
        <ScInputPassword
          className={cssUtils.marginBottom}
          fullWidth
          error={!!errors.code}
          helperText={errors.code?.message ?? m.activationCodeDesc}
          label={m.activationCode}
          {...register('code', {
            required: {value: true, message: m.required},
            pattern: {value: regexp.activationCode, message: m.activationCodeInvalid},
          })}
        />
        <ScInput
          className={cssUtils.marginBottom}
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message ?? m.emailDesc}
          label={m.email}
          {...register('email', {
            required: {value: true, message: m.required},
            pattern: {value: regexp.email, message: m.invalidEmail},
          })}
        />
        <div className={css.foot}>
          <ScButton loading={registerAction.loading} type="submit" color="primary" variant="contained">
            {m.activateMyAccount}
          </ScButton>
        </div>
      </form>
    </LoginPanel>
  )
}
