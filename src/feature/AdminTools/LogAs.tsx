import { CleanWidePanel } from '../../shared/Panel/simplePanels'
import { ScInput } from '../../shared/ScInput'
import React from 'react'
import { ScButton } from '../../shared/Button'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { regexp } from '../../core/helper/regexp'
import { useI18n } from '../../core/i18n'

interface LogAsForm {
  email: string
}

export const LogAs = () => {
  const { m } = useI18n()
  const { setConnectedUser, apiSdk: api } = useConnectedContext()
  const navigate = useNavigate()

  const _logAs = useMutation({
    mutationFn: (email: string) => api.public.authenticate.logAs(email),
  })

  const onSubmit = async (form: LogAsForm) => {
    const user = await _logAs.mutateAsync(form.email)
    setConnectedUser(user)
    navigate('/')
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
      <p>
        Fonctionnalité permettant de se connecter comme un autre utilisateur.
        Cela permet p. ex. d'investiguer un bug remonté par un pro.
      </p>
      <p>
        Pour le moment, cette fonctionnalité est réservée aux{' '}
        <strong>SuperAdmin</strong> et ne permet que de se connecter en tant que{' '}
        <strong>professionnel.</strong>
      </p>
      <p>
        Une fois connecté, les évènements Matomo sont désactivés, et les actions
        (p.ex. répondre à un signalement) sont interdites.
      </p>
      <form
        className="flex items-start gap-4 mt-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ScInput
          {...register('email', {
            required: { value: true, message: m.required },
            pattern: { value: regexp.email, message: m.invalidEmail },
          })}
          fullWidth
          type="email"
          label="Email du professionnel"
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
