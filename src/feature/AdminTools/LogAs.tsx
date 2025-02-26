import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { regexp } from '../../core/helper/regexp'
import { useI18n } from '../../core/i18n'
import { ScButton } from '../../shared/Button'
import { CleanWidePanel } from '../../shared/Panel/simplePanels'
import { ScInput } from '../../shared/ScInput'
import { useNavigate } from '@tanstack/react-router'

interface LogAsForm {
  email: string
}

export const LogAs = () => {
  const { m } = useI18n()
  const { setConnectedUser, api: api } = useConnectedContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const _logAs = useMutation({
    mutationFn: (email: string) => api.public.authenticate.logAs(email),
  })

  const onSubmit = async (form: LogAsForm) => {
    const user = await _logAs.mutateAsync(form.email)
    setConnectedUser(user)
    navigate({ to: '/' })
    queryClient.resetQueries()
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogAsForm>({
    mode: 'onChange',
    defaultValues: { email: ' ' },
  })

  return (
    <CleanWidePanel>
      <h2 className="font-bold text-lg mb-2">Impersonification</h2>
      <p className="mb-2">
        Fonctionnalité permettant de se connecter comme un autre utilisateur.
        Cela permet p. ex. d'investiguer un bug remonté par un pro.
      </p>
      <p className="mb-2">
        Cette fonctionnalité ne permet que de se connecter en tant que{' '}
        <strong>professionnel</strong> ou <strong>agent.</strong>
      </p>
      <p className="mb-2">
        Une fois connecté, les évènements Matomo sont désactivés, et les actions
        (p.ex. répondre à un signalement) sont interdites.
      </p>
      <form
        className="flex gap-2 items-start"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ScInput
          {...register('email', {
            required: { value: true, message: m.required },
            pattern: { value: regexp.email, message: m.invalidEmail },
          })}
          fullWidth
          type="email"
          label="Email du pro ou de l'agent"
          error={!!errors.email}
          helperText={errors.email?.message ?? ' '}
        />
        <ScButton
          sx={{ mt: '8px' }}
          color="primary"
          variant="contained"
          type="submit"
          disabled={_logAs.isPending}
          loading={_logAs.isPending}
        >
          Login
        </ScButton>
      </form>
    </CleanWidePanel>
  )
}
