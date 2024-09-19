import { CleanWidePanel } from '../../shared/Panel/simplePanels'
import { ScInput } from '../../shared/ScInput'
import React, { useState } from 'react'
import { ScButton } from '../../shared/Button'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

export const LogAs = () => {
  const { setConnectedUser, apiSdk: api } = useConnectedContext()
  const navigate = useNavigate()

  const _logAs = useMutation({
    mutationFn: (email: string) => api.public.authenticate.logAs(email),
  })

  const [email, setEmail] = useState<string>('')

  return (
    <CleanWidePanel>
      <h2 className="font-bold text-lg mb-2">Connexion en tant que</h2>
      <div className="flex items-center gap-4">
        <ScInput
          fullWidth
          type="text"
          label="Email du pro"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ScButton
          onClick={() =>
            _logAs.mutateAsync(email).then((user) => {
              setConnectedUser(user)
              navigate('/')
            })
          }
          color="primary"
          variant="contained"
          disabled={_logAs.isPending}
          loading={_logAs.isPending}
        >
          Login
        </ScButton>
      </div>
    </CleanWidePanel>
  )
}
