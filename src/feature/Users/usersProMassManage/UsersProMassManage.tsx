import { Button, Icon } from '@mui/material'
import { config } from 'conf/config'
import { useState } from 'react'
import { DsfrStepper } from 'shared/DsfrStepper'
import { Page, PageTitle } from 'shared/Page'
import { MassManageConfirmation } from './MassManageConfirmation'
import { MassManageOperationSelection } from './MassManageOperationSelection'
import { ProCompaniesSelection } from './ProCompaniesSelection'
import { ProUsersSelection } from './ProUsersSelection'
import { MassManageChoices } from './usersProMassManagementConstants'

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

export function AccessesManagementPro() {
  const initialChoices: MassManageChoices = {
    operation: null,
    companiesIds: [],
    users: {
      usersIds: [],
      alreadyInvitedTokenIds: [],
      emailsToInvite: [],
    },
  }
  const [choices, setChoices] = useState<MassManageChoices>(initialChoices)
  const [stepNumber, setStepNumber] = useState<number | undefined>(
    config.isManuDev ? 2 : undefined,
  )
  const step = stepNumber !== undefined ? steps[stepNumber] : undefined
  function incrementStepNumber() {
    setStepNumber((s) => (s === undefined ? 0 : s + 1))
  }
  function decrementStepNumber() {
    setStepNumber((s) => (s === undefined || s === 0 ? undefined : s - 1))
  }
  function resetChoices() {
    setChoices(initialChoices)
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
                onClick={() => {
                  resetChoices()
                  setStepNumber(0)
                }}
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
          choices={choices}
          onSubmit={({ operation }) => {
            setChoices((prev) => {
              // the operation choices has some effects on the later steps
              // better to reset everything when it changes.
              if (operation !== prev.operation) {
                return {
                  ...initialChoices,
                  operation,
                }
              }
              return { ...prev, operation }
            })
            incrementStepNumber()
          }}
        />
      )}
      {step === 'companiesSelection' && (
        <ProCompaniesSelection
          choices={choices}
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
          choices={choices}
          allowInvitation={choices.operation !== 'remove'}
          onSubmit={(users) => {
            setChoices((prev) => ({
              ...prev,
              users,
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
