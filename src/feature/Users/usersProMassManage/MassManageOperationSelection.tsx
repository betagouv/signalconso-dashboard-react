import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { NextButton } from './usersProMassManageTinyComponents'

type OnSubmit = (_: { operation: Operation }) => void
export function MassManageOperationSelection({
  onSubmit,
}: {
  onSubmit: OnSubmit
}) {
  return (
    <CleanInvisiblePanel>
      <p className="mb-2">Que voulez-vous faire ?</p>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        className="flex flex-col gap-4 w-fit"
      >
        <FormControlLabel
          value="remove"
          control={<Radio />}
          className="border !m-0 border-gray-400 p-2 py-4"
          label={
            <div>
              <p className="font-bold text-lg">Retirer des accès</p>
              <p className="text-sm">
                Les utilisateurs ne pourront plus accéder à ces entreprises
              </p>
            </div>
          }
        />
        <FormControlLabel
          value="membre"
          control={<Radio />}
          className="border !m-0 border-gray-400 p-2 py-4"
          label={
            <div>
              <p className="font-bold  text-lg">Définir en tant que membre</p>
              <ul className="text-sm">
                <li>
                  Les utilisateurs auront un accès "membre" à ces entreprises.
                </li>
                <li>
                  Ils pourront consulter et répondre aux signalements de ces
                  entreprises.
                </li>
                <li>
                  Ils ne pourront pas gérer les accès des autres utilisateurs.
                </li>
                <li>
                  S'ils étaient déjà "administrateurs", ils redescendront au
                  niveau "membre".
                </li>
              </ul>
            </div>
          }
        />
        <FormControlLabel
          value="admin"
          control={<Radio />}
          className="border !m-0 border-gray-400 p-2 py-4"
          label={
            <div>
              <p className="font-bold text-lg">
                Définir en tant qu'administrateur
              </p>
              <ul className="text-sm">
                <li>
                  Les utilisateurs auront un accès "administrateur" à ces
                  entreprises.
                </li>
                <li>
                  Ils pourront consulter et répondre aux signalements de ces
                  entreprises.
                </li>
                <li className="underline">
                  Ils pourront aussi gérer les accès des autres utilisateurs .
                </li>
                <li>
                  S'ils étaient déjà "membres", ils monteront au niveau
                  "administrateur".
                </li>
              </ul>
            </div>
          }
        />
      </RadioGroup>
      <NextButton
        disabled={false}
        onClick={() => {
          onSubmit({ operation: 'remove' })
        }}
      />
    </CleanInvisiblePanel>
  )
}
