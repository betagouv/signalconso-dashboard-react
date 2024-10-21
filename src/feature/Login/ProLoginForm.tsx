import { DashboardTitle } from 'feature/Login/loggedOutComponents'
import { CenteredContent } from 'shared/CenteredContent'
import { ApiError } from '../../core/client/ApiClient'
import { SignalConsoPublicSdk } from '../../core/client/SignalConsoPublicSdk'
import { useI18n } from '../../core/i18n'
import { InfoBanner } from '../../shared/InfoBanner'
import { LoginForm } from './LoginForm'

interface ActionProps<F extends (...args: any[]) => Promise<any>> {
  action: F
  loading?: boolean
  error?: ApiError
}

interface Props {
  login: ActionProps<SignalConsoPublicSdk['authenticate']['login']>
}

export interface Form {
  email: string
  password: string
  apiError: string
}

export const ProLoginForm = ({ login }: Props) => {
  const { m } = useI18n()

  return (
    <CenteredContent>
      <InfoBanner />
      <DashboardTitle subPageTitle={m.login} title={'Espace Pro'} />
      <LoginForm login={login} />
    </CenteredContent>
  )
}
