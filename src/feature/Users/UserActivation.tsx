import React, {useEffect, useState} from 'react'
import {useToast} from '../../core/toast'
import {ScInputPassword} from '../../shared/InputPassword/InputPassword'
import {Controller, useForm} from 'react-hook-form'
import {UserToActivate} from '../../core/api'
import {useI18n} from '../../core/i18n'
import {ScInput} from '../../shared/Input/ScInput'
import {makeStyles} from '@material-ui/core/styles'
import {Checkbox, FormControl, FormControlLabel, FormHelperText, Theme} from '@material-ui/core'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {ScButton} from '../../shared/Button/Button'
import {Page, PageTitle} from '../../shared/Layout'
import querystring from 'querystring'
import {useHistory, useLocation, useParams} from 'react-router'
import {siteMap} from '../../core/siteMap'
import {useAsync} from '@alexandreannic/react-hooks-lib'
import {Alert, AlertTitle} from '@material-ui/lab'
import {AccountEventActions, ActionResultNames, EventCategories, Matomo} from '../../core/analyics/Matomo'

interface UserActivationForm extends UserToActivate {
  repeatPassword: string
  consent: boolean
}

const useStyles = makeStyles((t: Theme) => ({
  foot: {
    marginTop: t.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  hint: {
    marginBottom: t.spacing(1),
    '& a': {
      color: t.palette.primary.main,
      fontWeight: t.typography.fontWeightBold,
    },
  },
  alert: {
    marginBottom: t.spacing(2),
  },
}))

interface Props {
  onActivateUser: (user: UserToActivate, token: string, companySiret?: string) => Promise<any>
  onFetchTokenInfo: (token: string, companySiret?: string) => Promise<any>
}

export const UserActivation = ({onActivateUser, onFetchTokenInfo}: Props) => {
  const {m} = useI18n()
  const _activate = useAsync(onActivateUser)
  const _tokenInfo = useAsync(onFetchTokenInfo)
  const cssUtils = useCssUtils()
  const css = useStyles()
  const {toastSuccess, toastError} = useToast()
  const {search} = useLocation()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState<string>('')
  const [canActivate, setCanActivate] = useState<boolean>(false)
  const {siret} = useParams<{siret: string}>()

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm<UserActivationForm>({
    mode: 'onChange',
    defaultValues: {email: ' '},
  })

  useEffect(() => {
    const token = querystring.parse(search.replace(/^\?/, '')).token as string
    setToken(token)
    console.log('-----------------------------------------------')
    console.log(siret)

    _tokenInfo
      .call(token, siret)
      .then(tokenInfo => {
        setEmail(tokenInfo.emailedTo)
        setCanActivate(true)
      })
      .catch(e => {
        setCanActivate(false)
      })
  }, [])

  const onSubmit = (form: UserActivationForm) => {
    _activate
      .call({...form, email: email}, token, siret)
      .then(_ => {
        Matomo.trackEvent(EventCategories.account, AccountEventActions.registerUser, ActionResultNames.success)
        history.push(siteMap.login)
      })
      .catch(e => {
        Matomo.trackEvent(EventCategories.account, AccountEventActions.registerUser, ActionResultNames.fail)
        toastError({message: m.activationFailed})
      })
  }

  return (
    <Page size="small">
      <PageTitle>{m.createMyAccount}</PageTitle>

      {!canActivate && (
        <Alert id="subscriptions-info" variant={'outlined'} className={css.hint} severity="error">
          <AlertTitle>{m.cannotActivateAccountAlertTitle}</AlertTitle>
          <div dangerouslySetInnerHTML={{__html: m.cannotActivateAccountAlertInfo}} />
        </Alert>
      )}

      {canActivate && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <ScInput
            className={cssUtils.marginBottom}
            fullWidth
            error={!!errors.email}
            helperText={' '}
            disabled={true}
            label={m.email}
            value={email}
          />
          <ScInput
            className={cssUtils.marginBottom}
            fullWidth
            error={!!errors.firstName}
            helperText={' '}
            label={m.firstName}
            {...register('firstName', {
              required: {value: true, message: m.required},
            })}
          />
          <ScInput
            className={cssUtils.marginBottom}
            fullWidth
            error={!!errors.lastName}
            helperText={' '}
            label={m.lastName}
            {...register('lastName', {
              required: {value: true, message: m.required},
            })}
          />
          <ScInputPassword
            className={cssUtils.marginBottom}
            inputProps={{
              autocomplete: 'false',
            }}
            autoComplete="false"
            error={!!errors.password}
            helperText={errors.password?.message ?? ' '}
            fullWidth
            label={m.password}
            {...register('password', {
              required: {value: true, message: m.required},
              minLength: {value: 8, message: m.passwordNotLongEnough},
            })}
          />
          <ScInputPassword
            className={cssUtils.marginBottom}
            inputProps={{
              autocomplete: 'false',
            }}
            autoComplete="false"
            error={!!errors.repeatPassword}
            helperText={errors.repeatPassword?.message ?? ' '}
            fullWidth
            label={m.newPasswordConfirmation}
            {...register('repeatPassword', {
              required: {value: true, message: m.required},
              minLength: {value: 8, message: m.passwordNotLongEnough},
              validate: value => value === getValues().password || m.passwordDoesntMatch,
            })}
          />
          <Controller
            name="consent"
            defaultValue={false}
            control={control}
            rules={{required: {value: true, message: m.required}}}
            render={({field}) => (
              <FormControl required error={!!errors.consent}>
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label={<div className={css.hint} dangerouslySetInnerHTML={{__html: m.consent}} />}
                />
                <FormHelperText> {errors.consent?.message ?? ' '}</FormHelperText>
              </FormControl>
            )}
          />
          <div className={css.foot}>
            <ScButton loading={_activate.loading} type="submit" color="primary" variant="contained">
              {m.activateMyAccount}
            </ScButton>
          </div>
        </form>
      )}
    </Page>
  )
}
