import {TextField} from '@mui/material'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router'
import {Alert, Btn, Txt} from '../../alexlibs/mui-extension'
import {useAccessesContext} from '../../core/context/AccessesContext'
import {useLogin} from '../../core/context/LoginContext'
import {regexp} from '../../core/helper/regexp'
import {useI18n} from '../../core/i18n'
import {AccessEventActions, ActionResultNames, EventCategories, Matomo} from '../../core/plugins/Matomo'
import {siteMap} from '../../core/siteMap'
import {useToast} from '../../core/toast'
import {HelpContactInfo} from '../../shared/HelpContactInfo'
import {ScInputPassword} from '../../shared/ScInputPassword'
import {AlertContactSupport} from 'feature/Login/loggedOutComponents'

interface Form {
  siret: string
  code: string
}

export const AddCompanyForm = () => {
  const {m} = useI18n()
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
    <div className="w-full max-w-lg mx-auto mt-14 flex flex-col gap-4">
      <h1 className="text-center text-2xl">Ajout d'une entreprise à votre compte</h1>
      {_acceptToken.error && (
        <Alert type="error" sx={{mb: 2}}>
          <Txt size="big" block bold>
            {m.registerCompanyError}
          </Txt>
          <Txt>{m.registerCompanyErrorDesc}</Txt>
        </Alert>
      )}
      <Alert type="info">
        <p className="mb-2">
          Utilisez ce formulaire si vous avez reçu un courrier postal de SignalConso concernant une autre entreprise que vous
          gérez.
        </p>
        <p>L'entreprise sera ajouté à votre compte ({connectedUser.email}) et vous pourrez consulter ses signalements.</p>
      </Alert>

      <form onSubmit={handleSubmit(acceptToken)} className="flex flex-col gap-4">
        <TextField
          sx={{mb: 1}}
          variant="filled"
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
        <div className="flex flex-col">
          <Btn loading={_acceptToken.loading} type="submit" size="large" color="primary" variant="contained">
            {m.addCompany}
          </Btn>
        </div>
      </form>
      <AlertContactSupport />
    </div>
  )
}
