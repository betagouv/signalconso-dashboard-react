import { Box, Chip } from '@mui/material'
import { DashboardTitle } from 'feature/Login/loggedOutComponents'
import { CenteredContent } from 'shared/CenteredContent'
import { ApiError } from '../../core/client/ApiClient'
import { InfoBanner } from '../../shared/InfoBanner'
import { Divider } from '../../shared/Divider'
import ProConnectButton from './ProConnectButton'
import { LoginForm } from './LoginForm'
import React from 'react'
import { PublicApiSdk } from '../../core/client/PublicApiSdk'

interface ActionProps<F extends (...args: any[]) => Promise<any>> {
  action: F
  loading?: boolean
  error?: ApiError
}

interface Props {
  login: ActionProps<PublicApiSdk['authenticate']['login']>
  startProConnect: ActionProps<PublicApiSdk['authenticate']['startProConnect']>
  redirect?: string
}

export const AgentLoginForm = ({ login, startProConnect, redirect }: Props) => {
  return (
    <CenteredContent>
      <InfoBanner />
      <DashboardTitle title="Espace Agent" />
      <Box
        marginTop={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <Box display="flex" justifyContent="center" width="100%" maxWidth="80%">
          <Box flex="1" padding={4} maxWidth="50%">
            <h1 className="text-2xl mb-8 font-bold">
              Se connecter avec son compte SignalConso
            </h1>
            <p className={'mt-4 mb-6 text-lg'}>
              J'ai été invité à rejoindre SignalConso et j'ai créé mon compte
              avec un mot de passe ou je me suis déjà connecté à Signal Conso
              avec mes identifiants.
            </p>
            <LoginForm login={login} redirect={redirect} />
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ height: 'auto', marginX: 4, alignSelf: 'stretch' }}
          >
            <Chip label="OU" size="small" color={'primary'} />
          </Divider>
          <Box
            flex="1"
            padding={4}
            maxWidth="50%"
            display="flex"
            justifyContent="center"
          >
            <ProConnectButton startProConnect={startProConnect} />
          </Box>
        </Box>
      </Box>
    </CenteredContent>
  )
}
