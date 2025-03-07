import { TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AlertContactSupport } from 'feature/Login/loggedOutComponents'
import { useForm } from 'react-hook-form'
import { Alert, Btn, Txt } from '../../alexlibs/mui-extension'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useToast } from '../../core/context/toast/toastContext'
import { regexp } from '../../core/helper/regexp'
import { useI18n } from '../../core/i18n'
import {
  AccessEventActions,
  AnalyticActionName,
  EventCategories,
  trackEvent,
} from '../../core/plugins/Matomo'
import { ScInputPassword } from '../../shared/ScInputPassword'

interface Form {
  siret: string
  code: string
}

export const AddCompanyForm = () => {
  const { m } = useI18n()
  const { connectedUser, api: apiSdk } = useConnectedContext()
  const _acceptToken = useMutation({
    mutationFn: (params: { siret: string; token: string }) =>
      apiSdk.secured.accesses.acceptToken(params.siret, params.token),
    onSuccess: () => {
      toastSuccess(m.companyRegistered)
      history({ to: '/mes-entreprises' })
      trackEvent(
        connectedUser,
        EventCategories.AccesDeLEntreprise,
        AccessEventActions.addCompanyToAccount,
        AnalyticActionName.success,
      )
    },
    onError: () => {
      trackEvent(
        connectedUser,
        EventCategories.AccesDeLEntreprise,
        AccessEventActions.addCompanyToAccount,
        AnalyticActionName.fail,
      )
    },
  })
  const { toastSuccess } = useToast()
  const history = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ mode: 'onSubmit' })

  const acceptToken = (form: Form) => {
    _acceptToken.mutate({ siret: form.siret, token: form.code })
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-14 flex flex-col gap-4">
      <h1 className="text-center text-2xl">
        Ajout d'une entreprise à votre compte
      </h1>
      {_acceptToken.error && (
        <Alert type="error" sx={{ mb: 2 }}>
          <Txt size="big" block bold>
            {m.registerCompanyError}
          </Txt>
          <Txt>{m.registerCompanyErrorDesc}</Txt>
        </Alert>
      )}
      <Alert type="info">
        <p className="mb-2">
          Utilisez ce formulaire si vous avez reçu un courrier postal de
          SignalConso concernant une autre entreprise que vous gérez.
        </p>
        <p>
          L'entreprise sera ajouté à votre compte ({connectedUser.email}) et
          vous pourrez consulter ses signalements.
        </p>
      </Alert>

      <form
        onSubmit={handleSubmit(acceptToken)}
        className="flex flex-col gap-4"
      >
        <TextField
          sx={{ mb: 1 }}
          variant="filled"
          fullWidth
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
        <ScInputPassword
          sx={{ mb: 1 }}
          fullWidth
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
        <div className="flex flex-col">
          <Btn
            loading={_acceptToken.isPending}
            type="submit"
            size="large"
            color="primary"
            variant="contained"
          >
            {m.addCompany}
          </Btn>
        </div>
      </form>
      <AlertContactSupport />
    </div>
  )
}
