import {useI18n} from '../../core/i18n'
import {ScInput} from '../../shared/Input/ScInput'
import {useForm} from 'react-hook-form'
import {regexp} from '../../core/helper/regexp'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {LoginPanel} from './LoginPanel'
import {ScButton} from '../../shared/Button/Button'
import {makeStyles} from '@material-ui/core/styles'
import {Theme} from '@material-ui/core'
import {ActionProps} from './LoginPage'

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
  const {
    register,
    handleSubmit,
    getValues,
    formState: {errors, isValid},
  } = useForm<Form>({mode: 'onSubmit'})

  const activateAccount = (form: Form) => {
    registerAction.action(form.siret, form.code, form.email)
  }

  return (
    <LoginPanel title={m.youReceivedNewLetter}>
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
        <ScInput
          className={cssUtils.marginBottom}
          fullWidth
          type="password"
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
