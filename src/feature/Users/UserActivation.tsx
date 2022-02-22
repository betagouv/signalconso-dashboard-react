import React, {useEffect, useMemo} from 'react'
import {useToast} from '../../core/toast'
import {ScInputPassword} from '../../shared/InputPassword/InputPassword'
import {Controller, useForm} from 'react-hook-form'
import {TokenInfo, UserToActivate} from '@signal-conso/signalconso-api-sdk-js'
import {useI18n} from '../../core/i18n'
import {ScInput} from '../../shared/Input/ScInput'
import makeStyles from '@mui/styles/makeStyles'
import {Checkbox, FormControl, FormControlLabel, FormHelperText, Theme} from '@mui/material'
import {ScButton} from '../../shared/Button/Button'
import {Page, PageTitle} from '../../shared/Layout'
import {useHistory, useLocation, useParams} from 'react-router'
import {siteMap} from '../../core/siteMap'
import {useAsync} from '@alexandreannic/react-hooks-lib'
import {Alert, PanelFoot} from 'mui-extension'
import {AccountEventActions, ActionResultNames, EventCategories, Matomo} from '../../core/plugins/Matomo'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {Panel, PanelBody} from '../../shared/Panel'
import {QueryString} from '../../core/helper/useQueryString'

interface UserActivationForm extends UserToActivate {
  repeatPassword: string
  consent: boolean
}

const useStyles = makeStyles((t: Theme) => ({
  hint: {
    '& a': {
      color: t.palette.primary.main,
      fontWeight: t.typography.fontWeightBold,
    },
  },
}))

interface Props {
  onActivateUser: (user: UserToActivate, token: string, companySiret?: string) => Promise<void>
  onFetchTokenInfo: (token: string, companySiret?: string) => Promise<TokenInfo>
}

export const UserActivation = ({onActivateUser, onFetchTokenInfo}: Props) => {
  const {m} = useI18n()
  const _activate = useAsync(onActivateUser)
  const _tokenInfo = useFetcher(onFetchTokenInfo)
  const css = useStyles()
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
    <Page size="small">
      <PageTitle>{m.createMyAccount}</PageTitle>

      <Panel loading={_tokenInfo.loading}>
        {_tokenInfo.error ? (
          <Alert type="error" className={css.hint}>
            <Txt size="big" block bold gutterBottom>
              {m.cannotActivateAccountAlertTitle}
            </Txt>
            <div dangerouslySetInnerHTML={{__html: m.cannotActivateAccountAlertInfo}} />
          </Alert>
        ) : (
          _tokenInfo.entity && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <PanelBody>
                <ScInput
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message ?? ' '}
                  disabled={true}
                  label={m.email}
                  value={_tokenInfo.entity.emailedTo}
                />
                <ScInput
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message ?? ' '}
                  label={m.firstName}
                  {...register('firstName', {
                    required: {value: true, message: m.required},
                  })}
                />
                <ScInput
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message ?? ' '}
                  label={m.lastName}
                  {...register('lastName', {
                    required: {value: true, message: m.required},
                  })}
                />
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
                    minLength: {value: 8, message: m.passwordNotLongEnough},
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
              </PanelBody>
              <PanelFoot>
                <ScButton loading={_activate.loading} type="submit" color="primary" variant="contained">
                  {m.activateMyAccount}
                </ScButton>
              </PanelFoot>
            </form>
          )
        )}
      </Panel>
    </Page>
  )
}
