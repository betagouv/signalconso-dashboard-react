import { Button, Icon } from '@mui/material'
import { useState } from 'react'
import { DsfrStepper } from 'shared/DsfrStepper'
import { Page, PageTitle } from 'shared/Page'
import { ProCompaniesSelection } from './usersProMassManage/ProCompaniesSelection'

const steps = [
  'Choix des entreprises',
  'Que voulez-vous-faire ?',
  'Sélectionner des utilisateurs',
  'Confirmation',
] as const

export function AccessesManagementPro() {
  const [step, setStep] = useState<number | undefined>()
  return (
    <Page>
      <PageTitle>Gestion des accès</PageTitle>
      <div className="">
        {step === undefined && (
          <div className="max-w-4xl space-y-4">
            <p className="">
              Cette page vous permet d'ajouter, supprimer, ou modifier les accès
              de <b>un ou plusieurs utilisateurs</b> à{' '}
              <b>une ou plusieurs entreprises</b>, en quelques clics.
            </p>
            <div className="flex-shrink-0">
              <Button
                variant="contained"
                onClick={() => setStep(0)}
                size="large"
                endIcon={<Icon>arrow_forward</Icon>}
              >
                Je commence
              </Button>
            </div>
          </div>
        )}
      </div>

      {step !== undefined && (
        <DsfrStepper
          currentStep={step || 0}
          steps={steps}
          onPrevious={() =>
            setStep((s) => (s === undefined || s === 0 ? undefined : s - 1))
          }
        />
      )}
      {step === 0 && <ProCompaniesSelection />}
    </Page>
  )
}
