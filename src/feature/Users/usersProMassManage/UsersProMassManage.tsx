import { Button, Icon } from '@mui/material'
import { useState } from 'react'
import { DsfrStepper } from 'shared/DsfrStepper'
import { Page, PageTitle } from 'shared/Page'
import { MassManageConfirmation } from './MassManageConfirmation'
import { MassManageOperationSelection } from './MassManageOperationSelection'
import { ProCompaniesSelection } from './ProCompaniesSelection'
import { ProUsersSelection } from './ProUsersSelection'

const steps = [
  'operationSelection',
  'companiesSelection',
  'usersSelection',
  'confirmation',
] as const
const stepsName = {
  operationSelection: "Choix de l'action",
  companiesSelection: 'Choix des entreprises',
  usersSelection: 'Choix des utilisateurs',
  confirmation: 'Confirmation',
}

export type MassManageOperation = 'remove' | 'set_member' | 'set_admin'
export type MassManageChoices = {
  operation: MassManageOperation
  companiesIds: string[]
  usersIds: string[]
  emailsToInvite: string[]
}

export function AccessesManagementPro() {
  const [choices, setChoices] = useState<MassManageChoices>({
    operation: 'set_member',
    companiesIds: [],
    usersIds: [],
    emailsToInvite: [],
  })
  const [stepNumber, setStepNumber] = useState<number | undefined>()
  const step = stepNumber !== undefined ? steps[stepNumber] : undefined
  function incrementStepNumber() {
    setStepNumber((s) => (s === undefined ? 0 : s + 1))
  }
  function decrementStepNumber() {
    setStepNumber((s) => (s === undefined || s === 0 ? undefined : s - 1))
  }
  console.log('@@@ choices', choices)
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
          onPrevious={decrementStepNumber}
        />
      )}
      {step === 'operationSelection' && (
        <MassManageOperationSelection
          onSubmit={({ operation }) => {
            setChoices((prev) => ({ ...prev, operation }))
            incrementStepNumber()
          }}
        />
      )}
      {step === 'companiesSelection' && (
        <ProCompaniesSelection
          onSubmit={({ selectedCompaniesIds }) => {
            setChoices((prev) => ({
              ...prev,
              companiesIds: selectedCompaniesIds,
            }))
            incrementStepNumber()
          }}
        />
      )}
      {step === 'usersSelection' && (
        <ProUsersSelection
          allowInvitation
          onSubmit={({ selectedUserIds, emailsToInvite }) => {
            setChoices((prev) => ({
              ...prev,
              usersIds: selectedUserIds,
              emailsToInvite,
            }))
            incrementStepNumber()
          }}
        />
      )}
      {step === 'confirmation' && (
        <MassManageConfirmation
          choices={choices}
          onSubmit={() => {
            console.log('@@@@ onSubmit', choices)
          }}
        />
      )}
    </Page>
  )
}
