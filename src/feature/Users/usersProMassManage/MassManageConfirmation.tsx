import { Button } from '@mui/material'
import { MassManageChoices, MassManageOperation } from './UsersProMassManage'

export function MassManageConfirmation({
  choices,
  onSubmit,
}: {
  choices: MassManageChoices
  onSubmit: () => void
}) {
  return (
    <div>
      <div className="mx-auto w-fit">
        <div className="mb-8">
          <p className="mb-4">
            <span>
              Les{' '}
              <BigNumber>
                {choices.usersIds.length + choices.emailsToInvite.length}
              </BigNumber>{' '}
              utilisateurs sélectionnés
            </span>{' '}
            <span className="font-bold">
              {choices.operation === 'remove'
                ? 'vont perdre leur accès'
                : choices.operation === 'set_member'
                  ? 'vont être ajoutés en tant que membres'
                  : "vont être ajoutés en tant qu'administrateurs"}
            </span>{' '}
            <span>
              aux <BigNumber>{choices.companiesIds.length}</BigNumber>{' '}
              entreprises sélectionnées.
            </span>
          </p>
          {buildAdditionalMessages(choices.operation).map((m) => (
            <p key={m}>{m}</p>
          ))}
          {choices.emailsToInvite.length > 0 && (
            <p>
              Ceux qui n'avaient pas encore de compte SignalConso recevront une
              invitation pour le créer.
            </p>
          )}
        </div>
        <div className="flex justify-center">
          <Button variant="contained" size="large" onClick={onSubmit}>
            Valider
          </Button>
        </div>
      </div>
    </div>
  )
}
function BigNumber({ children }: { children: React.ReactNode }) {
  return <b className="text-2xl">{children}</b>
}

function buildAdditionalMessages(operation: MassManageOperation) {
  switch (operation) {
    case 'remove':
      return ["(s'ils y avaient accès)"]
    case 'set_member':
      return [
        'Ils pourront consulter et répondre aux signalements de ces entreprises, mais ne pourront pas ajouter ou supprimer des utilisateurs.',
        "S'ils avaient un accès administrateur, ils seront rétrogradés.",
        "S'ils avait déjà un accès membre, cela ne changera rien.",
      ]
    case 'set_admin':
      return [
        'Ils pourront consulter et répondre aux signalements de ces entreprises, et ajouter ou supprimer des utilisateurs.',
        "S'ils avaient un accès membre, ils seront promus.",
        "S'ils avait déjà un accès administrateur, cela ne changera rien.",
      ]
  }
}
