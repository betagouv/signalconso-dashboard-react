import { useConnectedContext } from 'core/context/ConnectedContext'
import React from 'react'
import { Button } from '@mui/material'
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
        <Button
          href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${companySiret.trim()}`}
          target="_blank"
          rel="noreferrer"
          variant="text"
          color="primary"
          endIcon={<Launch />}
          onClick={(_) => _}
        >
          <img
            src={logoGouvMobile}
            alt="voir sur annuaire des entreprise"
            className="h-[60px] image-rendering-auto"
          />
        </Button>
      </div>
    )
  }

  return null
}
