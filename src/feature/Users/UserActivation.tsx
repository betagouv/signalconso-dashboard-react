import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
} from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { validatePasswordComplexity } from 'core/helper/passwordComplexity'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router'
import { PasswordRequirementsDesc } from 'shared/PasswordRequirementsDesc'
import { Alert, makeSx, Txt } from '../../alexlibs/mui-extension'
import { TokenInfo } from '../../core/client/authenticate/Authenticate'
import { User, UserToActivate } from '../../core/client/user/User'
import { useToast } from '../../core/context/toastContext'
import { QueryString } from '../../core/helper/useQueryString'
import { useI18n } from '../../core/i18n'
import {
  AccountEventActions,
  ActionResultNames,
  EventCategories,
  Matomo,
} from '../../core/plugins/Matomo'
import { FetchTokenInfoQueryKeys } from '../../core/queryhooks/userQueryHooks'
import { siteMap } from '../../core/siteMap'
import { ScButton } from '../../shared/Button'
import { Page, PageTitle } from '../../shared/Page'
import { Panel, PanelBody } from '../../shared/Panel'
import { ScInputPassword } from '../../shared/ScInputPassword'

interface UserActivationForm extends UserToActivate {
  repeatPassword: string
  consent: boolean
}

const sx = makeSx({
  hint: {
    '& a': {
      color: (t) => t.palette.primary.main,
      fontWeight: (t) => t.typography.fontWeightBold,
    },
  },
})

interface Props {
  onUserActivated: (_: User) => void
  onActivateUser: (
    user: UserToActivate,
    token: string,
    companySiret?: string,
  ) => Promise<User>
  onFetchTokenInfo: (token: string, companySiret?: string) => Promise<TokenInfo>
}

export const UserActivation = ({
  onActivateUser,
  onUserActivated,
  onFetchTokenInfo,
}: Props) => {
  const { m } = useI18n()
  const _activate = useMutation({
    mutationFn: (params: {
      user: UserToActivate
      token: string
      companySiret?: string
    }) => onActivateUser(params.user, params.token, params.companySiret),
  })
  const { toastSuccess, toastError } = useToast()

  const { search } = useLocation()
  const history = useNavigate()

  const { siret } = useParams<{ siret: string }>()

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<UserActivationForm>({
    mode: 'onChange',
    defaultValues: { email: ' ' },
  })

  const urlToken = useMemo(
    () => QueryString.parse(search.replace(/^\?/, '')).token as string,
    [],
  )

  const _tokenInfo = useQuery({
    queryKey: FetchTokenInfoQueryKeys(urlToken, siret),
    queryFn: () => onFetchTokenInfo(urlToken, siret),
  })

  const onSubmit = (form: UserActivationForm) => {
    if (!_tokenInfo.data) return
    _activate
      .mutateAsync({
        user: { ...form, email: _tokenInfo.data.emailedTo },
        token: urlToken,
        companySiret: siret,
      })
      .then((user) => {
        Matomo.trackEvent(
          EventCategories.account,
          AccountEventActions.registerUser,
          ActionResultNames.success,
        )
        toastSuccess(m.accountActivated)
        onUserActivated(user)
        history(siteMap.logged.reports())
      })
      .catch((e) => {
        Matomo.trackEvent(
          EventCategories.account,
          AccountEventActions.registerUser,
          ActionResultNames.fail,
        )
        toastError({ message: m.activationFailed })
      })
  }

  return (
    <Page maxWidth="s">
      <PageTitle>{m.finishCreatingMyAccount}</PageTitle>

      <Panel loading={_tokenInfo.isLoading}>
        {_tokenInfo.error ? (
          <Alert type="error" sx={sx.hint}>
            <Txt size="big" block bold gutterBottom>
              {m.cannotActivateAccountAlertTitle}
            </Txt>
            <div
              dangerouslySetInnerHTML={{
                __html: m.cannotActivateAccountAlertInfo,
              }}
            />
          </Alert>
        ) : (
          _tokenInfo.data && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <PanelBody>
                <TextField
                  fullWidth
                  variant="filled"
                  error={!!errors.email}
                  helperText={errors.email?.message ?? ' '}
                  disabled={true}
                  label={m.email}
                  value={_tokenInfo.data.emailedTo}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message ?? ' '}
                  label={m.firstName}
                  {...register('firstName', {
                    required: { value: true, message: m.required },
                  })}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message ?? ' '}
                  label={m.lastName}
                  {...register('lastName', {
                    required: { value: true, message: m.required },
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
                    required: { value: true, message: m.required },
                    validate: (value: string) => {
                      const complexityMessage =
                        validatePasswordComplexity(value)
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
                    required: { value: true, message: m.required },
                    validate: (value) =>
                      value === getValues().password || m.passwordDoesntMatch,
                  })}
                />
                <Controller
                  name="consent"
                  defaultValue={false}
                  control={control}
                  rules={{ required: { value: true, message: m.required } }}
                  render={({ field }) => (
                    <FormControl required error={!!errors.consent}>
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label={
                          <Box
                            sx={sx.hint}
                            dangerouslySetInnerHTML={{ __html: m.consent }}
                          />
                        }
                      />
                      <FormHelperText>
                        {' '}
                        {errors.consent?.message ?? ' '}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </PanelBody>
              <div className="flex justify-center mb-4">
                <ScButton
                  loading={_activate.isPending}
                  type="submit"
                  color="primary"
                  size="large"
                  variant="contained"
                >
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
