import { siteMap } from 'core/siteMap'
import { CenteredContent } from 'shared/CenteredContent'
import { AlertNotForConso, DashboardTitle } from './loggedOutComponents'
import { Icon } from '@mui/material'
import { InfoBanner } from '../../shared/InfoBanner'
import {Link, useLocation} from "@tanstack/react-router";

export function WelcomePage() {
  const location = useLocation()

  return (
    <CenteredContent>
      <InfoBanner />
      <DashboardTitle title={'Espace Pro'} />
      <div className="flex gap-6 justify-center mb-8 px-2">
        <Tile
          title="J'ai reçu un courrier de SignalConso à propos de mon entreprise"
          desc="Je crée mon compte"
          href={siteMap.loggedout.register}
        />
        <Tile
          title="J'ai déjà un compte pour mon entreprise"
          desc="Je me connecte pour consulter et répondre aux signalements"
          href={siteMap.loggedout.login}
          search={location.search}
        />
      </div>
      <AlertNotForConso />
    </CenteredContent>
  )
}

function Tile({
  title,
  desc,
  href,
  search
}: {
  title: string
  desc: string
  href: string
  search?: any
}) {
  return (
    <Link
      to={href}
      search={search}
      className="block no-underline relative border border-b-4 border-b-scbluefrance border-gray-300 border-solid py-20 px-8 text-center max-w-sm"
    >
      <h2 className="text-scbluefrance font-bold mb-2 text-lg">{title}</h2>
      <p className="mb-12">{desc}</p>
      <Icon className="absolute right-6 bottom-6 text-scbluefrance !text-2xl">
        arrow_forward
      </Icon>
    </Link>
  )
}
