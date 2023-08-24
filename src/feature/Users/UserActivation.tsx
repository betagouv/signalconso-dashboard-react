import {Box, Checkbox, FormControl, FormControlLabel, FormHelperText, TextField} from '@mui/material'
import {validatePasswordComplexity} from 'core/helper/passwordComplexity'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useHistory, useLocation, useParams} from 'react-router'
import {PasswordRequirementsDesc} from 'shared/PasswordRequirementsDesc'
import {Alert, Txt, makeSx} from '../../alexlibs/mui-extension'
import {useAsync, useFetcher} from '../../alexlibs/react-hooks-lib'
import {TokenInfo} from '../../core/client/authenticate/Authenticate'
import {UserToActivate} from '../../core/client/user/User'
import {QueryString} from '../../core/helper/useQueryString'
import {useI18n} from '../../core/i18n'
import {AccountEventActions, ActionResultNames, EventCategories, Matomo} from '../../core/plugins/Matomo'
import {siteMap} from '../../core/siteMap'
import {useToast} from '../../core/toast'
import {ScButton} from '../../shared/Button'
import {Page, PageTitle} from '../../shared/Page'
import {Panel, PanelBody} from '../../shared/Panel'
import {ScInputPassword} from '../../shared/ScInputPassword'

interface UserActivationForm extends UserToActivate {
  repeatPassword: string
  consent: boolean
}

const sx = makeSx({
  hint: {
    '& a': {
      color: t => t.palette.primary.main,
      fontWeight: t => t.typography.fontWeightBold,
    },
  },
})

interface Props {
  onActivateUser: (user: UserToActivate, token: string, companySiret?: string) => Promise<void>
  onFetchTokenInfo: (token: string, companySiret?: string) => Promise<TokenInfo>
}

export const UserActivation = ({onActivateUser, onFetchTokenInfo}: Props) => {
  const {m} = useI18n()
  const _activate = useAsync(onActivateUser)
  const _tokenInfo = useFetcher(onFetchTokenInfo)
  const {toastSuccess, toastError} = useToast()

  const {search} = useLocation()
  const history = useHistory()

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

  const urlToken = useMemo(() => QueryString.parse(search.replace(/^\?/, '')).token as string, [])

  useEffect(() => {
    _tokenInfo.fetch({}, urlToken, siret)
  }, [])

  const onSubmit = (form: UserActivationForm) => {
    if (!_tokenInfo.entity) return
    _activate
      .call({...form, email: _tokenInfo.entity.emailedTo}, urlToken, siret)
      .then(_ => {
        Matomo.trackEvent(EventCategories.account, AccountEventActions.registerUser, ActionResultNames.success)
        toastSuccess(m.accountActivated)
        setTimeout(() => history.push(siteMap.loggedout.login), 400)
      })
      .catch(e => {
        Matomo.trackEvent(EventCategories.account, AccountEventActions.registerUser, ActionResultNames.fail)
        toastError({message: m.activationFailed})
      })
  }

  return (
    <Page size="s">
      <PageTitle>{m.finishCreatingMyAccount}</PageTitle>

      <Panel loading={_tokenInfo.loading}>
        {_tokenInfo.error ? (
          <Alert type="error" sx={sx.hint}>
            <Txt size="big" block bold gutterBottom>
              {m.cannotActivateAccountAlertTitle}
            </Txt>
            <div dangerouslySetInnerHTML={{__html: m.cannotActivateAccountAlertInfo}} />
          </Alert>
        ) : (
          _tokenInfo.entity && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <PanelBody>
                <TextField
                  fullWidth
                  variant="filled"
                  error={!!errors.email}
                  helperText={errors.email?.message ?? ' '}
                  disabled={true}
                  label={m.email}
                  value={_tokenInfo.entity.emailedTo}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message ?? ' '}
                  label={m.firstName}
                  {...register('firstName', {
                    required: {value: true, message: m.required},
                  })}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message ?? ' '}
                  label={m.lastName}
                  {...register('lastName', {
                    required: {value: true, message: m.required},
                  })}
                />
                <PasswordRequirementsDesc />
                <ScInputPassword
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
                    validate: (value: string) => {
                      const complexityMessage = validatePasswordComplexity(value)
                      if (complexityMessage) {
                        return m[complexityMessage]
                      }
                    },
                  })}
                />
                <ScInputPassword
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
                        label={<Box sx={sx.hint} dangerouslySetInnerHTML={{__html: m.consent}} />}
                      />
                      <FormHelperText> {errors.consent?.message ?? ' '}</FormHelperText>
                    </FormControl>
                  )}
                />
              </PanelBody>
              <div className="flex justify-center mb-4">
                <ScButton loading={_activate.loading} type="submit" color="primary" size="large" variant="contained">
                  {m.createMyAccount}
                </ScButton>
              </div>
            </form>
          )
        )}
      </Panel>
    </Page>
  )
}
