import { Icon } from '@mui/material'
import { useConnectedContext } from 'core/context/ConnectedContext'
import { ScDialog } from './ScDialog'

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
  if (!connectedUser.isAdmin) {
    // Temporary, because I haven't implemented the "À propos" page
    return null
  }
  return (
    <div
      className={`font-normal bg-desert-200 w-fit flex gap-2 items-center ${smaller ? `text-sm` : `p-1 text-base`}`}
    >
      <span className="inline-flex items-center gap-1  font-serif  text-desert-700 italic">
        <Icon fontSize={smaller ? 'small' : 'medium'}>bubble_chart</Icon>“
        {children}”
      </span>
      {withExplainButton && (
        <ScDialog
          title={`Contenu produit par de l'IA`}
          content={(_) => (
            <>
              <p>Ce texte :</p>
              <AlbertActivityLabel>{children}</AlbertActivityLabel>
              <p className="mb-2">
                a été produit par <b>une intelligence artificielle</b>.
              </p>
              <p className="mb-2">
                C'est une description sommaire de l'activité de cette
                entreprise, d'après ce que notre IA a pu comprendre en regardant
                ses derniers signalements.
              </p>
              <p>
                <b>L'IA fait des erreurs et des approximations.</b> Considérez
                ce contenu comme un outil pratique mais pas 100% fiable.
              </p>
            </>
          )}
        >
          <button className="text-gray-500 text-sm underline">
            (à propos)
          </button>
        </ScDialog>
      )}
    </div>
  )
}
