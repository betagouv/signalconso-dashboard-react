import { Button, Icon } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useApiContext } from 'core/context/ApiContext'
import { useState } from 'react'
import { DsfrAlert } from 'shared/DsfrAlert'
import { DsfrStepper } from 'shared/DsfrStepper'
import { Page, PageTitle } from 'shared/Page'
import { MassManageCompaniesSelection } from './MassManageCompaniesSelection'
import { MassManageConfirmation } from './MassManageConfirmation'
import { MassManageOperationSelection } from './MassManageOperationSelection'
import { MassManageUsersSelection } from './MassManageUsersSelection'
import {
  MassManageInputs,
  MassManageOperation,
} from './usersProMassManagementConstants'
const steps = [
  'operationSelection',
  'companiesSelection',
  'usersSelection',
  'confirmation',
  'success',
] as const
const stepsName = {
  operationSelection: "Choix de l'action",
  companiesSelection: 'Choix des entreprises',
  usersSelection: 'Choix des utilisateurs',
  confirmation: 'Confirmation',
  success: '',
}

export function AccessesManagementPro() {
  const wizard = useWizardState()
  return (
    <Page>
      <PageTitle>Gestion des accès avancée</PageTitle>

      <div className="">
        {wizard.step === undefined && (
          <div className="max-w-4xl space-y-4">
            <p className="">
              Cette page vous permet d'ajouter, supprimer, ou modifier les accès
              de <b>un ou plusieurs utilisateurs</b> à{' '}
              <b>une ou plusieurs entreprises</b>, en quelques clics.
            </p>
            <div className="flex-shrink-0">
              <Button
                variant="contained"
                onClick={wizard.start}
                size="large"
                endIcon={<Icon>arrow_forward</Icon>}
              >
                Je commence
              </Button>
            </div>
          </div>
        )}
      </div>
      {wizard.stepNumber !== undefined && wizard.step !== 'success' && (
        <DsfrStepper
          currentStep={wizard.stepNumber}
          steps={steps.filter((_) => _ !== 'success').map((s) => stepsName[s])}
          onPrevious={wizard.decrementStepNumber}
        />
      )}
      {(() => {
        switch (wizard.step) {
          case undefined:
            return null
          case 'operationSelection':
            return (
              <MassManageOperationSelection
                choices={wizard.choices}
                onSubmit={wizard.handleStep0}
              />
            )
          case 'companiesSelection':
            return (
              <MassManageCompaniesSelection
                choices={wizard.choices}
                onSubmit={wizard.handleStep1}
              />
            )
          case 'usersSelection':
            return (
              <MassManageUsersSelection
                choices={wizard.choices}
                allowInvitation={wizard.choices.operation !== 'Remove'}
                onSubmit={wizard.handleStep2}
              />
            )
          case 'confirmation':
            return (
              <MassManageConfirmation
                choices={wizard.choices}
                onSubmit={wizard.handleStep3}
                isMutationPending={wizard.isMutationPending}
              />
            )
          case 'success':
            return (
              <div className="max-w-4xl mt-4 space-y-4">
                <DsfrAlert title="Modification effectuée" type="success">
                  La modification des droits d'accès a été faite avec succès.
                </DsfrAlert>
                <Button variant="contained" onClick={wizard.reset}>
                  Retourner au début
                </Button>
              </div>
            )
          default:
            return wizard.step satisfies never
        }
      })()}
    </Page>
  )
}

function useWizardState() {
  const { api } = useApiContext()
  const initialChoices: MassManageInputs = {
    operation: null,
    companiesIds: [],
    users: {
      usersIds: [],
      alreadyInvitedEmails: [],
      emailsToInvite: [],
    },
  }
  const [choices, setChoices] = useState<MassManageInputs>(initialChoices)
  const [stepNumber, setStepNumber] = useState<number | undefined>(undefined)
  const _massManage = useMutation({
    mutationFn: ({ choices }: { choices: MassManageInputs }) =>
      api.secured.accessesMassManagement.massManage(choices),
  })
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
  function reset() {
    resetChoices()
    setStepNumber(undefined)
  }
  function start() {
    resetChoices()
    setStepNumber(0)
  }
  function handleStep0(operation: MassManageOperation) {
    setChoices((prev) => ({
      ...prev,
      operation,
    }))
    incrementStepNumber()
  }
  function handleStep1(companiesIds: string[]) {
    setChoices((prev) => ({
      ...prev,
      companiesIds,
    }))
    incrementStepNumber()
  }
  function handleStep2(users: MassManageInputs['users']) {
    setChoices((prev) => ({
      ...prev,
      users,
    }))
    incrementStepNumber()
  }
  async function handleStep3() {
    await _massManage.mutateAsync({ choices })
    incrementStepNumber()
  }
  return {
    step,
    stepNumber,
    choices,
    decrementStepNumber,
    start,
    reset,
    handleStep0,
    handleStep1,
    handleStep2,
    handleStep3,
    isMutationPending: _massManage.isPending,
  }
}
