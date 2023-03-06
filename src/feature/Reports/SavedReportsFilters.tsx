import {Icon, List, ListItem, ListItemSecondaryAction} from '@mui/material'
import {Btn} from '../../alexlibs/mui-extension'
import React, {useState} from 'react'
import {ScInput} from '../../shared/Input/ScInput'
import {NamedReportSearch} from '../../core/client/report/NamedReportSearch'

interface SavedFiltersItemProps {
  initialName: string
  onSave: (oldName: string, newName: string) => void
  onDelete: (name: string) => void
  setDefault: (name: string) => void
  unsetDefault: (name: string) => void
  allNames: string[]
  default: boolean
}

const SavedFiltersItem = ({
  initialName,
  onSave,
  onDelete,
  allNames,
  default: defaultFilters,
  setDefault,
  unsetDefault,
}: SavedFiltersItemProps) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [name, setName] = useState<string>(initialName)

  const alreadyExists = name !== initialName && allNames.includes(name)
  const canSave = !alreadyExists && name !== ''

  const save = (name: string) => {
    if (canSave) {
      if (initialName !== name) {
        onSave(initialName, name)
      }
      setEdit(false)
    }
  }

  const changeName = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)

  return (
    <ListItem>
      <ScInput
        label="Nom du filtre"
        error={alreadyExists}
        helperText={alreadyExists ? 'Le filtre existe déjà' : ''}
        value={name}
        onChange={changeName}
        disabled={!edit}
      />
      <ListItemSecondaryAction>
        {defaultFilters ? (
          <Btn color="primary" onClick={() => unsetDefault(name)}>
            <Icon>star</Icon>
          </Btn>
        ) : (
          <Btn color="primary" onClick={() => setDefault(name)}>
            <Icon>star_border</Icon>
          </Btn>
        )}
        {edit ? (
          <Btn color="primary" onClick={() => save(name)} disabled={!canSave}>
            <Icon>save</Icon>
          </Btn>
        ) : (
          <Btn color="primary" onClick={() => setEdit(true)}>
            <Icon>edit</Icon>
          </Btn>
        )}
        <Btn color="primary" onClick={() => onDelete(name)}>
          <Icon>delete</Icon>
        </Btn>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

interface SavedReportsFiltersProps {
  filters: NamedReportSearch[]
  onSave: (oldName: string, newName: string) => void
  onDelete: (name: string) => void
  setAsDefault: (name: string) => void
  unsetDefault: (name: string) => void
}

export const SavedReportsFilters = ({filters, onSave, onDelete, setAsDefault, unsetDefault}: SavedReportsFiltersProps) => {
  const filterNames = filters.map(filter => filter.name)
  return (
    <List sx={{minWidth: 420}}>
      {filters.map(filter => (
        <SavedFiltersItem
          initialName={filter.name}
          onSave={onSave}
          onDelete={onDelete}
          allNames={filterNames}
          default={filter.default}
          setDefault={setAsDefault}
          unsetDefault={unsetDefault}
        />
      ))}
    </List>
  )
}
