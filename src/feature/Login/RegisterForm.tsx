import { Icon, TextField } from '@mui/material'
import {
  AlertContactSupport,
  DashboardTitle,
} from 'feature/Login/loggedOutComponents'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CenteredContent } from 'shared/CenteredContent'
import { Alert, Txt } from '../../alexlibs/mui-extension'
import { ApiError } from '../../core/client/ApiClient'
import { regexp } from '../../core/helper/regexp'
import { useI18n } from '../../core/i18n'
import {
  AccessEventActions,
  AnalyticActionName,
  EventCategories,
  trackEventUnconnected,
} from '../../core/plugins/Matomo'
import { ScButton } from '../../shared/Button'
import { InfoBanner } from '../../shared/InfoBanner'

interface ActionProps<F extends (...args: any[]) => Promise<any>> {
  action: F
  loading?: boolean
  error?: ApiError
}

interface Form {
  siret: string
  code: string
  email: string
  apiError: string
}

interface Props {
  register: ActionProps<
    (siret: string, code: string, email: string) => Promise<any>
  >
  siret?: string
  code?: string
}

export const RegisterForm = ({
  register: registerAction,
  siret,
  code,
}: Props) => {
  const { m } = useI18n()
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<Form>({
    mode: 'onChange',
    defaultValues: { siret: siret ?? '', code: code ?? '' },
  })

  const activateAccount = (form: Form) => {
    clearErrors('apiError')
    registerAction
      .action(form.siret, form.code, form.email)
      .then(() => {
        trackEventUnconnected(
          EventCategories.CompteUtilisateur,
          AccessEventActions.activateCompanyCode,
          AnalyticActionName.success,
        )
        setDone(true)
      })
      .catch((err: ApiError) => {
        setError('apiError', {
          type: err.details.id,
          message: err.message,
        })
        trackEventUnconnected(
          EventCategories.AccesDeLEntreprise,
          AccessEventActions.activateCompanyCode,
          AnalyticActionName.fail,
        )
      })
  }

  const textFieldProps = {
    variant: 'filled',
    fullWidth: true,
  } as const

  return (
    <CenteredContent>
      <InfoBanner />
      <DashboardTitle subPageTitle={m.accountCreation} title={'Espace Pro'} />

      <div className="w-full max-w-xl px-2">
        {done ? (
          <Alert type="success">
            <Txt block bold size="big">
              {m.accountAlmostReady}
            </Txt>
            <Txt
              dangerouslySetInnerHTML={{ __html: m.companyRegisteredEmailSent }}
            />
          </Alert>
        ) : (
          <form
            onSubmit={handleSubmit(activateAccount)}
            className="flex flex-col gap-4"
          >
            {errors.apiError && (
              <Alert type="error" className="mb-4">
                <Txt size="big" block bold>
                  {m.registerCompanyError}
                </Txt>
                <Txt>{errors.apiError.message}</Txt>
              </Alert>
            )}
            <TextField
              {...textFieldProps}
              placeholder={m.siretExample}
              error={!!errors.siret}
              helperText={errors.siret?.message ?? m.siretOfYourCompanyDesc}
              label={m.siretOfYourCompany}
              {...register('siret', {
                required: { value: true, message: m.required },
                pattern: {
                  value: regexp.siret,
                  message: m.siretOfYourCompanyInvalid,
                },
              })}
            />
            <TextField
              {...textFieldProps}
              placeholder={m.activationCodeExample}
              error={!!errors.code}
              helperText={errors.code?.message ?? m.activationCodeDesc}
              label={m.activationCode}
              {...register('code', {
                required: { value: true, message: m.required },
                pattern: {
                  value: regexp.activationCode,
                  message: m.activationCodeInvalid,
                },
              })}
            />
            <div className="flex flex-col gap-2 mb-4">
              <TextField
                {...textFieldProps}
                error={!!errors.email}
                helperText={errors.email?.message ?? m.emailDesc}
                label={m.yourEmail}
                {...register('email', {
                  required: { value: true, message: m.required },
                  pattern: { value: regexp.email, message: m.invalidEmail },
                })}
              />
              <div className="flex flex-col gap-2 text-gray-500 mx-3">
                <p className="">
                  <InfoIcon /> {m.willReceiveVerificationEmail}
                </p>
                <p className="">
                  <InfoIcon />{' '}
                  <span className="font-bold text-gray-600">
                    {m.willUseThisEmailToCommunicate}
                  </span>
                  . {m.newReportsWillBeSentThere}
                </p>
                <p className="">
                  <InfoIcon /> {m.willUseItToConnect}
                </p>
              </div>
            </div>

            <div className="flex flex-xcol gap-4 justify-center mb-4">
              <ScButton
                loading={registerAction.loading}
                onClick={(_) => clearErrors('apiError')}
                type="submit"
                color="primary"
                variant="contained"
                size="large"
                className=""
              >
                {m.imCreatingMyAccount}
              </ScButton>
            </div>
            <AlertContactSupport />
          </form>
        )}
      </div>
    </CenteredContent>
  )
}

function InfoIcon() {
  return (
    <Icon className="align-[-0.2em]" fontSize="small">
      info_outlined
    </Icon>
  )
}
