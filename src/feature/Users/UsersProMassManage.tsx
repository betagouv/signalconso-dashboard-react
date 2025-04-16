import { Button } from '@mui/material'
import { useState } from 'react'
import { DsfrStepper } from 'shared/DsfrStepper'
import { Page, PageTitle } from 'shared/Page'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'
import { ProCompaniesSelection } from './usersProMassManage/ProCompaniesSelection'
import { ProUsersSelection } from './usersProMassManage/ProUsersSelection'

type Subpage = 'selectOperation' | 'selectCompanies' | 'selectUsers'

export function AccessesManagementPro() {
  const [subpage, setSubpage] = useState<Subpage | undefined>()
  return (
    <Page>
      <DsfrStepper
        currentStep={0}
        steps={[
          "Titre de l'étape en cours",
          'Titre de la prochaine étape',
          'Sélectionner des utilisateurs',
        ]}
      />

      <DsfrStepper
        currentStep={1}
        steps={[
          'Sélectionner une opération',
          'Sélectionner des entreprises',
          'Sélectionner des utilisateurs',
          'Confirmation',
        ]}
      />

      <DsfrStepper
        currentStep={4}
        steps={[
          'Sélectionner une opération',
          'Sélectionner des entreprises',
          'Sélectionner des utilisateurs',
          'Confirmation',
        ]}
      />

      {!subpage && (
        <>
          <PageTitle>Gestion des accès</PageTitle>
          <p className="mb-8">
            Cette page vous permet d'ajouter, supprimer, ou modifier les accès
            de <b>un ou plusieurs utilisateurs</b> à{' '}
            <b>une ou plusieurs entreprises</b>, en quelques clics.
          </p>
          <div className="space-y-2">
            <h2 className="font-bold text-2xl">Que voulez-vous faire ?</h2>
            <div className="flex gap-2">
              <CleanDiscreetPanel>Retirer des accès</CleanDiscreetPanel>
              <CleanDiscreetPanel>
                Ajouter ou modifier des accès
              </CleanDiscreetPanel>
            </div>
            <h2 className="font-bold text-2xl">Entreprises sélectionnées</h2>
            <div className="flex gap-2 items-center">
              <p>2 entreprises sélectionnées</p>
              <Button
                variant="outlined"
                onClick={() => setSubpage('selectCompanies')}
              >
                modifier
              </Button>
            </div>
            <h2 className="font-bold text-2xl">Utilisateurs sélectionnés</h2>
            <div className="flex gap-2 items-center">
              <p>10 utilisateurs sélectionnés</p>
              <Button
                variant="outlined"
                onClick={() => setSubpage('selectUsers')}
              >
                modifier
              </Button>
            </div>
          </div>
        </>
      )}
      {subpage === 'selectCompanies' && (
        <>
          <PageTitle>{' > '} Sélection des entreprises</PageTitle>
          <ProCompaniesSelection />
        </>
      )}
      {subpage === 'selectUsers' && <ProUsersSelection />}
    </Page>
  )
}
