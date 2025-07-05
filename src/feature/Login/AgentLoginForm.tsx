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
import { useLayoutContext } from '../../core/context/layoutContext/layoutContext'

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
  const { isMobileWidth } = useLayoutContext()

  return (
    <CenteredContent>
      <InfoBanner />
      <DashboardTitle title="Espace Agent" />
      <div className="mt-4 flex justify-center items-center w-full">
        <div className="flex justify-center w-full md:max-w-[80%] md:flex-row flex-col">
          <div className="flex-1 p-4 md:max-w-[50%] max-w-full">
            <h1 className="text-2xl mb-8 font-bold">
              Se connecter avec son compte SignalConso
            </h1>
            <p className={'mt-4 mb-6 text-lg'}>
              J'ai été invité à rejoindre SignalConso et j'ai créé mon compte
              avec un mot de passe ou je me suis déjà connecté à Signal Conso
              avec mes identifiants.
            </p>
            <LoginForm login={login} redirect={redirect} />
          </div>
          <Divider
            orientation={isMobileWidth ? 'horizontal' : 'vertical'}
            flexItem
            sx={{ height: 'auto', marginX: 4, alignSelf: 'stretch' }}
          >
            <Chip label="OU" size="small" color={'primary'} />
          </Divider>
          <div className="flex justify-center flex-1 p-4 md:max-w-[50%] max-w-full">
            <ProConnectButton startProConnect={startProConnect} />
          </div>
        </div>
      </div>
    </CenteredContent>
  )
}
