import { Icon } from '@mui/material'
import { Alert } from 'alexlibs/mui-extension'
import { config } from 'conf/config'
import { useI18n } from 'core/i18n'
import { siteMap } from 'core/siteMap'
import { Link } from 'react-router-dom'

export function AlertNotForConso() {
  return (
    <Alert type="info" className="max-w-lg mx-auto">
      <p className="mb-2">
        Cette page permet aux <span className="font-bold">professionnels</span>{' '}
        de consulter et de répondre aux signalements des consommateurs.
      </p>
      <p className="mb-2">
        Vous êtes un <span className="font-bold">consommateur</span> et vous
        souhaitez faire un signalement&nbsp;? Rendez-vous plutôt sur{' '}
        <a href={config.appBaseUrl} className="underline">
          la page d'accueil de SignalConso.
        </a>
      </p>
      {config.enableProConnect && (
        <p className="mb-2">
          Vous êtes un <span className="font-bold">agent</span>, rendez-vous sur{' '}
          <a href={siteMap.loggedout.loginAgent} className="underline">
            l'espace agent
          </a>{' '}
          pour vous connecter
        </p>
      )}
    </Alert>
  )
}

export function DashboardTitle({
  subPageTitle,
  title,
}: {
  subPageTitle?: string
  title?: string
}) {
  return (
    <h1 className="text-3xl mt-4 mb-8 text-center">
      {subPageTitle && (
        <Link to={siteMap.loggedout.welcome} className="no-underline mr-4">
          <Icon className="align-top !text-3xl">arrow_back</Icon>
        </Link>
      )}
      <span>SignalConso</span>{' '}
      <span className="font-bold text-scbluefrance">{title}</span>
      {subPageTitle && <span className=""> - {subPageTitle}</span>}
    </h1>
  )
}

export function AlertContactSupport() {
  const { m } = useI18n()
  return (
    <Alert type="info" className="max-w-md mx-auto">
      <p dangerouslySetInnerHTML={{ __html: m.loginIssueTip }} />
    </Alert>
  )
}
