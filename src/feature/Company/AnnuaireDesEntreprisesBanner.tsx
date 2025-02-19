import { useConnectedContext } from 'core/context/ConnectedContext'
import React from 'react'
import { Button, Tooltip } from '@mui/material'
import logoGouvMobile from './annuaire-entreprises.svg'
import { Launch } from '@mui/icons-material'

export function AnnuaireDesEntreprisesBanner({
  companySiret,
}: {
  companySiret: string
}) {
  const { connectedUser } = useConnectedContext()

  if (connectedUser.isNotPro) {
    return (
      <div className="justify-end mb-1 text-scbluefrance">
        <Tooltip
          title={
            "Voir sur Annuaire des Entreprises, un site de l'État pour accéder aux informations protégées des entreprises (statuts, actes, bilans financiers)."
          }
        >
          <Button
            href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${companySiret.trim()}`}
            target="_blank"
            rel="noreferrer"
            variant="text"
            color="primary"
            endIcon={<Launch />} // Assuming 'launch' is an icon you want to display after the button text
            onClick={(_) => _}
          >
            <img
              src={logoGouvMobile} // Ensure this is an SVG or high-resolution image
              alt="voir sur annuaire des entreprise"
              className="h-[60px] image-rendering-auto"
            />
          </Button>
        </Tooltip>
      </div>
    )
  }

  return null
}
