import { Button, CircularProgress } from '@mui/material'
import {
  MassManageInputs,
  MassManageOperation,
} from './usersProMassManagementConstants'

export function MassManageConfirmation({
  choices,
  onSubmit,
  isMutationPending,
}: {
  choices: MassManageInputs
  onSubmit: () => void
  isMutationPending: boolean
}) {
  const users = choices.users
  const usersNb =
    users.usersIds.length +
    users.alreadyInvitedEmails.length +
    users.emailsToInvite.length
  return (
    <div>
      <div className="mx-auto w-fit">
        <div className="mb-8">
          <p className="mb-4">
            <span>
              Les <BigNumber>{usersNb}</BigNumber> utilisateurs sélectionnés
            </span>{' '}
            <span className="font-bold">
              {choices.operation === 'Remove'
                ? 'vont perdre leur accès'
                : choices.operation === 'SetMember'
                  ? 'vont recevoir un accès simple'
                  : 'vont recevoir un accès administrateur'}
            </span>{' '}
            <span>
              aux <BigNumber>{choices.companiesIds.length}</BigNumber>{' '}
              entreprises sélectionnées.
            </span>
          </p>
          {buildAdditionalMessages(choices.operation).map((m) => (
            <p key={m}>{m}</p>
          ))}
          {users.emailsToInvite.length > 0 && (
            <p>
              Ceux qui n'avaient pas encore de compte SignalConso recevront une
              invitation pour le créer.
            </p>
          )}
        </div>
        <div className="flex justify-center">
          {isMutationPending ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" size="large" onClick={onSubmit}>
              Valider
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
function BigNumber({ children }: { children: React.ReactNode }) {
  return <b className="text-2xl">{children}</b>
}

function buildAdditionalMessages(operation: MassManageOperation | null) {
  switch (operation) {
    case 'Remove':
      return ["(s'ils y avaient accès)"]
    case 'SetMember':
      return [
        'Ils pourront consulter et répondre aux signalements de ces entreprises, mais ne pourront pas ajouter ou supprimer des utilisateurs.',
        "S'ils avaient un accès administrateur, ils seront rétrogradés.",
        "S'ils avaient déjà un accès simple, cela ne changera rien.",
      ]
    case 'SetAdmin':
      return [
        'Ils pourront consulter et répondre aux signalements de ces entreprises, et ajouter ou supprimer des utilisateurs.',
        "S'ils avaient un accès simple, ils seront promus.",
        "S'ils avaient déjà un accès administrateur, cela ne changera rien.",
      ]
    case null:
      // should not happen at this stage
      return []
  }
}
