import { Button, Icon } from '@mui/material'
import { useState } from 'react'
import { DsfrStepper } from 'shared/DsfrStepper'
import { Page, PageTitle } from 'shared/Page'
import { ProCompaniesSelection } from './usersProMassManage/ProCompaniesSelection'
import { ProUsersSelection } from './usersProMassManage/ProUsersSelection'

const steps = [
  'operationSelection',
  'companiesSelection',
  'usersSelection',
  'confirmation',
] as const
const stepsName = {
  operationSelection: 'Que voulez-vous-faire ?',
  companiesSelection: 'Choix des entreprises',
  usersSelection: 'Choix des utilisateurs',
  confirmation: 'Confirmation',
}

export function AccessesManagementPro() {
  const [stepNumber, setStepNumber] = useState<number | undefined>(2)
  const step = stepNumber !== undefined ? steps[stepNumber] : undefined
  return (
    <Page>
      <PageTitle>Gestion des accès</PageTitle>
      <div className="">
        {stepNumber === undefined && (
          <div className="max-w-4xl space-y-4">
            <p className="">
              Cette page vous permet d'ajouter, supprimer, ou modifier les accès
              de <b>un ou plusieurs utilisateurs</b> à{' '}
              <b>une ou plusieurs entreprises</b>, en quelques clics.
            </p>
            <div className="flex-shrink-0">
              <Button
                variant="contained"
                onClick={() => setStepNumber(0)}
                size="large"
                endIcon={<Icon>arrow_forward</Icon>}
              >
                Je commence
              </Button>
            </div>
          </div>
        )}
      </div>

      {stepNumber !== undefined && (
        <DsfrStepper
          currentStep={stepNumber || 0}
          steps={steps.map((s) => stepsName[s])}
          onPrevious={() =>
            setStepNumber((s) =>
              s === undefined || s === 0 ? undefined : s - 1,
            )
          }
        />
      )}
      {step === 'operationSelection' && <></>}
      {step === 'companiesSelection' && <ProCompaniesSelection />}
      {step === 'usersSelection' && <ProUsersSelection />}
      {step === 'confirmation' && <></>}
    </Page>
  )
}
