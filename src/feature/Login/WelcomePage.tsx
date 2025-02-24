import { CenteredContent } from 'shared/CenteredContent'
import { AlertNotForConso, DashboardTitle } from './loggedOutComponents'
import { Icon } from '@mui/material'
import { InfoBanner } from '../../shared/InfoBanner'
import { createLink, LinkComponent } from '@tanstack/react-router'
import React from 'react'

interface TileComponentProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string
  desc: string
}

const TileComponent = React.forwardRef<HTMLAnchorElement, TileComponentProps>(
  ({ title, desc, ...props }, ref) => {
    return (
      <a
        ref={ref}
        {...props}
        className="block no-underline relative border border-b-4 border-b-scbluefrance border-gray-300 border-solid py-20 px-8 text-center max-w-sm"
      >
        <h2 className="text-scbluefrance font-bold mb-2 text-lg">{title}</h2>
        <p className="mb-12">{desc}</p>
        <Icon className="absolute right-6 bottom-6 text-scbluefrance !text-2xl">
          arrow_forward
        </Icon>
      </a>
    )
  },
)

const CreatedTileComponent = createLink(TileComponent)

const Tile: LinkComponent<typeof TileComponent> = (props) => {
  return <CreatedTileComponent preload={'intent'} {...props} />
}

export function WelcomePage({ redirect }: { redirect?: string }) {
  return (
    <CenteredContent>
      <InfoBanner />
      <DashboardTitle title={'Espace Pro'} />
      <div className="flex gap-6 justify-center mb-8 px-2">
        <Tile
          title="J'ai reçu un courrier de SignalConso à propos de mon entreprise"
          desc="Je crée mon compte"
          to="/activation"
        />
        <Tile
          title="J'ai déjà un compte pour mon entreprise"
          desc="Je me connecte pour consulter et répondre aux signalements"
          to="/connexion"
          search={{ redirect }}
        />
      </div>
      <AlertNotForConso />
    </CenteredContent>
  )
}
