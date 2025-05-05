import { Icon } from '@mui/material'
import { useConnectedContext } from 'core/context/connected/connectedContext'
import BetaTag from 'shared/BetaTag'
import { Divider } from 'shared/Divider'
import { ScDialog } from '../ScDialog'

export function AlbertActivityLabel({
  children,
  smaller = false,
  withExplainButton = true,
}: {
  children: string
  smaller?: boolean
  withExplainButton?: boolean
}) {
  const { connectedUser } = useConnectedContext()
  if (connectedUser.isPro) {
    // The API doesn't return the field, but we still check here just in case
    return null
  }
  return (
    <div
      className={`pt-1 font-normal flex gap-1 items-center ${smaller ? `text-sm` : `text-base`}`}
    >
      <span className="inline-flex items-center gap-1">
        <Icon
          fontSize={smaller ? 'small' : 'medium'}
          className="text-desert-400"
        >
          label
        </Icon>
        <span className="text-desert-600">{children}</span>
      </span>
      {withExplainButton && (
        <span className="text-gray-500 text-sm ">
          {smaller || <span className="">d'après les signalements </span>}
          <ScDialog
            title={
              <span className="inline-flex items-center gap-1 strong">
                Description approximative de l'entreprise <BetaTag />
              </span>
            }
            content={(_) => (
              <>
                <p>Ce texte :</p>
                <AlbertActivityLabel withExplainButton={false}>
                  {children}
                </AlbertActivityLabel>
                <p className="mb-2">
                  est une description sommaire de l'activité de cette
                  entreprise.
                </p>
                <p className="mb-2">
                  Elle a été produite par une IA, en se basant{' '}
                  <b>
                    sur ce que décrivent les consommateurs de l'entreprise dans
                    les signalements récents
                  </b>
                  . C'est peut-être plus précis ou plus fiable que le code
                  d'activité.
                </p>
                <Divider margin />
                <p className="text-sm">
                  Note : la formulation exacte peut varier suivant les
                  entreprises. Une entreprise peut être décrite{' '}
                  <i>"Site de vente en ligne"</i> par exemple, tandis qu'une
                  autre avec une activité similaire sera{' '}
                  <i>"Site de e-commerce"</i>. Il n'y a pas de catégories fixes
                  sous-jacentes.
                </p>
              </>
            )}
          >
            <button className="underline">
              ({smaller ? '?' : 'explication'})
            </button>
          </ScDialog>
        </span>
      )}
    </div>
  )
}
