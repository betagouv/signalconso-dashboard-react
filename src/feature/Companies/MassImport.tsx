import React, {ReactElement, useState} from 'react'
import {Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material'
import {Btn} from '../../alexlibs/mui-extension'
import {useI18n} from '../../core/i18n'
import {DialogInputRow} from '../../shared/DialogInputRow'
import {ScInput} from '../../shared/ScInput'
import {Controller, useForm} from 'react-hook-form'
import {CompaniesToImport} from '../../core/client/company/Company'
import {useApiContext} from '../../core/context/ApiContext'
import {useMutation} from '@tanstack/react-query'
import {useToast} from '../../core/toast'

export interface MassImportProps {
  children: ReactElement<any>
}

export const MassImport = ({children}: MassImportProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const {m} = useI18n()
  const {toastError, toastSuccess} = useToast()
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<CompaniesToImport>()
  const {api} = useApiContext()

  const mutation = useMutation((companiesToImport: CompaniesToImport) => {
    return api.secured.company.importCompanies(companiesToImport)
  })

  const close = () => {
    setOpen(false)
  }

  const confirm = (e: any) => {
    handleSubmit(_ => mutation.mutate(_))(e)
      .then(() => toastSuccess('Import réussi'))
      .then(() => close())
      .catch(e => toastError(e))
  }

  return (
    <>
      {React.cloneElement(children, {
        onClick: (event: any) => {
          setOpen(true)
        },
      })}
      <Dialog fullWidth open={open ?? false} onClose={close}>
        <DialogTitle>Importer</DialogTitle>
        <DialogContent>
          <DialogInputRow label="SIREN">
            <ScInput
              error={!!errors.siren}
              helperText={errors.siren?.message ?? ' '}
              fullWidth
              {...register('siren', {
                pattern: {
                  value: /^[0-9]{9}$/,
                  message: 'SIREN invalide',
                },
              })}
            />
          </DialogInputRow>
          <DialogInputRow label="SIRETs">
            <Controller
              name="sirets"
              defaultValue={[]}
              rules={{
                validate: value => !!value.every(_ => _.match(/^[0-9]{14}$/)) || 'SIRET invalide',
              }}
              control={control}
              render={({field: {ref, onChange, ...field}}) => (
                <Autocomplete
                  onChange={(e, value) => onChange(value)}
                  defaultValue={[]}
                  clearIcon={false}
                  options={[]}
                  freeSolo
                  size="small"
                  multiple
                  renderInput={params => (
                    <TextField
                      {...params}
                      {...field}
                      inputRef={ref}
                      error={!!errors.sirets}
                      helperText={errors.sirets?.message ?? ' '}
                    />
                  )}
                />
              )}
            />
          </DialogInputRow>
          <DialogInputRow label="Emails">
            <Controller
              name="emails"
              rules={{
                required: 'requis',
                validate: value => !!value.every(_ => _.match(/.+@.+\..+/)) || 'Email invalide',
              }}
              control={control}
              render={({field: {ref, onChange, ...field}}) => (
                <Autocomplete
                  onChange={(e, value) => onChange(value)}
                  clearIcon={false}
                  options={[]}
                  freeSolo
                  size="small"
                  multiple
                  renderInput={params => (
                    <TextField
                      {...params}
                      {...field}
                      inputRef={ref}
                      error={!!errors.emails}
                      helperText={errors.emails?.message ?? ' '}
                    />
                  )}
                />
              )}
            />
          </DialogInputRow>
        </DialogContent>
        <DialogActions>
          <Btn onClick={close} color="primary">
            {m.close}
          </Btn>
          <Btn loading={mutation.isLoading} onClick={confirm} color="primary" variant="contained">
            Importer
          </Btn>
        </DialogActions>
      </Dialog>
    </>
  )
}
