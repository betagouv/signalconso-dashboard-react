import {Page} from 'alexlibs/mui-extension'
import {siteMap} from 'core/siteMap'
import {Link} from 'react-router-dom'
import {CenteredContent} from 'shared/CenteredContent/CenteredContent'
import {AlertNotForConso, EspaceProTitle} from './loggedOutComponents'
import {Icon} from '@mui/material'

export function WelcomePage() {
  return (
    <CenteredContent>
      <EspaceProTitle />
      <div className="flex gap-6 justify-center mb-8 px-2">
        <Tile
          title="J'ai reçu un courrier de SignalConso à propos de mon entreprise"
          desc="Je crée mon compte"
          href={siteMap.loggedout.register}
        />
        <Tile
          title="J'ai déjà un compte"
          desc="Je me connecte pour consulter et répondre aux signalements"
          href={siteMap.loggedout.login}
        />
      </div>
      <AlertNotForConso />
    </CenteredContent>
  )
}

function Tile({title, desc, href}: {title: string; desc: string; href: string}) {
  return (
    <Link
      to={href}
      className="block no-underline relative border border-b-4 border-b-scbluefrance border-gray-300 border-solid py-20 px-8 text-center max-w-sm"
    >
      <h2 className="text-scbluefrance font-bold mb-2 text-lg">{title}</h2>
      <p className="mb-12">{desc}</p>
      <Icon className="absolute right-6 bottom-6 text-scbluefrance !text-2xl">arrow_forward</Icon>
    </Link>
  )
}
