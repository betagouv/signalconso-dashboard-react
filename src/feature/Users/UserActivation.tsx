import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
} from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { publicApiSdk } from 'core/apiSdkInstances'
import { validatePasswordComplexity } from 'core/helper/passwordComplexity'
import { parse } from 'qs'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { PasswordRequirementsDesc } from 'shared/PasswordRequirementsDesc'
import { Alert, makeSx, Txt } from '../../alexlibs/mui-extension'
import { User, UserToActivate } from '../../core/client/user/User'
import { useToast } from '../../core/context/toast/toastContext'
import { useI18n } from '../../core/i18n'
import {
  AccountEventActions,
  AnalyticActionName,
  EventCategories,
  trackEventUnconnected,
} from '../../core/plugins/Matomo'
import { FetchTokenInfoQueryKeys } from '../../core/queryhooks/userQueryHooks'
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
  siret?: string
  onUserActivated: (_: User) => void
}

export const UserActivation = ({ siret, onUserActivated }: Props) => {
  const { m } = useI18n()
  const _activate = useMutation({
    mutationFn: (params: {
      user: UserToActivate
      token: string
      companySiret?: string
    }) =>
      publicApiSdk.user.activateAccount(
        params.user,
        params.token,
        params.companySiret,
      ),
  })
  const { toastSuccess, toastError } = useToast()
  const { searchStr } = useLocation()
  const history = useNavigate()
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
    () => parse(searchStr.replace(/^\?/, '')).token as string,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const _tokenInfo = useQuery({
    queryKey: FetchTokenInfoQueryKeys(urlToken, siret),
    queryFn: () => publicApiSdk.user.fetchTokenInfo(urlToken, siret),
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
        trackEventUnconnected(
          EventCategories.CompteUtilisateur,
          AccountEventActions.registerUser,
          AnalyticActionName.success,
        )
        toastSuccess(m.accountActivated)
        onUserActivated(user)
        history({ to: '/suivi-des-signalements' })
      })
      .catch((e) => {
        trackEventUnconnected(
          EventCategories.CompteUtilisateur,
          AccountEventActions.registerUser,
          AnalyticActionName.fail,
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
