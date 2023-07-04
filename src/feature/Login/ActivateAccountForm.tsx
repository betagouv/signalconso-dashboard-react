import {Box} from '@mui/material'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {Alert, Txt} from '../../alexlibs/mui-extension'
import {ApiError} from '../../core/client/ApiClient'
import {regexp} from '../../core/helper/regexp'
import {useI18n} from '../../core/i18n'
import {AccessEventActions, ActionResultNames, EventCategories, Matomo} from '../../core/plugins/Matomo'
import {ScButton} from '../../shared/Button/Button'
import {ScInput} from '../../shared/Input/ScInput'
import {ScInputPassword} from '../../shared/InputPassword/InputPassword'
import {ActionProps} from './LoginPage'
import {LoginPanel} from './LoginPanel'

interface Form {
  siret: string
  code: string
  email: string
  apiError: string
}

interface Props {
  register: ActionProps<(siret: string, code: string, email: string) => Promise<any>>
}

export const ActivateAccountForm = ({register: registerAction}: Props) => {
  const {m} = useI18n()
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: {errors},
  } = useForm<Form>({mode: 'onChange'})

  const activateAccount = (form: Form) => {
    clearErrors('apiError')
    registerAction
      .action(form.siret, form.code, form.email)
      .then(() => {
        Matomo.trackEvent(EventCategories.account, AccessEventActions.activateCompanyCode, ActionResultNames.success)
        setDone(true)
      })
      .catch((err: ApiError) => {
        setError('apiError', {
          type: err.details.id,
          message: err.message,
        })
        Matomo.trackEvent(EventCategories.companyAccess, AccessEventActions.activateCompanyCode, ActionResultNames.fail)
      })
  }

  return (
    <LoginPanel title={m.youReceivedNewLetter}>
      {done ? (
        <div>
          <Alert type="success" sx={{mb: 2}}>
            <Txt size="big" block bold>
              {m.companyRegistered}
            </Txt>
            <Txt dangerouslySetInnerHTML={{__html: m.companyRegisteredEmailSent}} />
          </Alert>
          <br />
        </div>
      ) : (
        <form onSubmit={handleSubmit(activateAccount)}>
          {errors.apiError && (
            <Alert type="error" sx={{mb: 2}}>
              <Txt size="big" block bold>
                {m.registerCompanyError}
              </Txt>
              <Txt>{errors.apiError.message}</Txt>
            </Alert>
          )}
          <ScInput
            sx={{mb: 1}}
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
            sx={{mb: 1}}
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
            sx={{mb: 1}}
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message ?? m.emailDesc}
            label={m.email}
            {...register('email', {
              required: {value: true, message: m.required},
              pattern: {value: regexp.email, message: m.invalidEmail},
            })}
          />
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ScButton
              loading={registerAction.loading}
              onClick={_ => clearErrors('apiError')}
              type="submit"
              color="primary"
              variant="contained"
            >
              {m.activateMyAccount}
            </ScButton>
          </Box>
        </form>
      )}
    </LoginPanel>
  )
}
