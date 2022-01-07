import React from 'react'
import {Page} from '../../shared/Layout'
import {LoginPanel} from '../Login/LoginPanel'
import {useI18n} from '../../core/i18n'
import {ScInput} from '../../shared/Input/ScInput'
import {regexp} from '../../core/helper/regexp'
import {ScButton} from '../../shared/Button/Button'
import {useCssUtils} from '../../core/helper/useCssUtils'
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from '@mui/material'
import {useLogin} from '../../core/context/LoginContext'
import {useForm} from 'react-hook-form'
import {useAccessesContext} from '../../core/context/AccessesContext'
import {useToast} from '../../core/toast'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useHistory} from 'react-router'
import {siteMap} from '../../core/siteMap'
import {Alert} from 'mui-extension'
import {ScInputPassword} from '../../shared/InputPassword/InputPassword'
import {AccessEventActions, ActionResultNames, EventCategories, Matomo} from '../../core/plugins/Matomo'
import {HelpContactInfo} from '../../shared/HelpContactInfo/HelpContactInfo'

interface Form {
  siret: string
  code: string
}

const useStyles = makeStyles((t: Theme) => ({
  foot: {
    marginTop: t.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
}))

export const ActivateNewCompany = () => {
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const css = useStyles()
  const {connectedUser} = useLogin()
  const _acceptToken = useAccessesContext().acceptToken
  const {toastSuccess} = useToast()
  const history = useHistory()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Form>({mode: 'onSubmit'})

  const acceptToken = (form: Form) => {
    _acceptToken
      .call(form.siret, form.code)
      .then(() => {
        toastSuccess(m.companyRegistered)
        history.push(siteMap.logged.companiesPro)
        Matomo.trackEvent(EventCategories.companyAccess, AccessEventActions.addCompanyToAccount, ActionResultNames.success)
      })
      .catch(() => {
        Matomo.trackEvent(EventCategories.companyAccess, AccessEventActions.addCompanyToAccount, ActionResultNames.fail)
      })
  }

  return (
    <Page size="small">
      <LoginPanel title={m.youReceivedNewLetter}>
        {_acceptToken.error && (
          <Alert type="error" className={cssUtils.marginBottom2}>
            <Txt size="big" block bold>
              {m.registerCompanyError}
            </Txt>
            <Txt>{m.registerCompanyErrorDesc}</Txt>
          </Alert>
        )}
        <form onSubmit={handleSubmit(acceptToken)}>
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
          <ScInput className={cssUtils.marginBottom} disabled fullWidth label={m.email} value={connectedUser.email} />
          <div className={css.foot}>
            <ScButton loading={_acceptToken.loading} type="submit" color="primary" variant="contained">
              {m.addCompany}
            </ScButton>
          </div>
        </form>
      </LoginPanel>
      <HelpContactInfo />
    </Page>
  )
}
