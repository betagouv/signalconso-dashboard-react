import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import {
  MassManageOperation,
  massManageOperations,
} from './usersProMassManagementConstants'
import { NextButton } from './usersProMassManageTinyComponents'

type OnSubmit = (_: { operation: MassManageOperation }) => void

export function MassManageOperationSelection({
  operation,
  onSubmit,
}: {
  operation: MassManageOperation | null
  onSubmit: OnSubmit
}) {
  const form = useForm<{ operation: MassManageOperation }>({
    defaultValues: { operation: operation ?? undefined },
  })
  return (
    <CleanInvisiblePanel>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <p className="mb-2">Que voulez-vous faire ?</p>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          className="flex flex-col gap-4 w-fit "
        >
          {massManageOperations.map((operation) => (
            <Controller
              key={operation}
              control={form.control}
              name="operation"
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
                formState,
              }) => {
                return (
                  <FormControlLabel
                    {...{ onBlur, onChange }}
                    value={operation}
                    control={<Radio checked={value === operation} />}
                    className="border !m-0 border-gray-400 p-2 py-4"
                    label={<Label operation={operation} />}
                  />
                )
              }}
            />
          ))}
        </RadioGroup>
        <NextButton disabled={form.watch('operation') === undefined} />
      </form>
    </CleanInvisiblePanel>
  )
}

function Label({ operation }: { operation: MassManageOperation }) {
  const { title, desc } = (() => {
    switch (operation) {
      case 'set_admin':
        return {
          title: "Définir en tant qu'administrateur",
          desc: [
            'Les utilisateurs auront un accès "administrateur" à ces entreprises.',
            'Ils pourront consulter et répondre aux signalements de ces entreprises.',
            <span className="underline">
              Ils pourront aussi gérer les accès des autres utilisateurs.
            </span>,
            'S\'ils étaient déjà "membres", ils monteront au niveau "administrateur".',
          ],
        }
      case 'set_member':
        return {
          title: 'Définir en tant que membre',
          desc: [
            'Les utilisateurs auront un accès "membre" à ces entreprises.',
            'Ils pourront consulter et répondre aux signalements de ces entreprises.',
            'Ils ne pourront pas gérer les accès des autres utilisateurs.',
            'S\'ils étaient déjà "administrateurs", ils redescendront au niveau "membre".',
          ],
        }
      case 'remove':
        return {
          title: 'Retirer des accès',
          desc: ['Les utilisateurs ne pourront plus accéder à ces entreprises'],
        }
      default:
        return operation satisfies never
    }
  })()
  return (
    <div className="">
      <p className="font-bold text-lg">{title}</p>
      <p className="text-sm">
        {desc.map((item, idx) => (
          <Fragment key={idx}>
            {item}
            <br />
          </Fragment>
        ))}
      </p>
    </div>
  )
}
