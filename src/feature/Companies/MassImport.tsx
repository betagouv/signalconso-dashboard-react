import {Autocomplete, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import React, {ReactElement, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {Btn} from '../../alexlibs/mui-extension'
import {AccessLevel, CompaniesToImport} from '../../core/client/company/Company'
import {useApiContext} from '../../core/context/ApiContext'
import {useI18n} from '../../core/i18n'
import {useToast} from '../../core/toast'
import {DialogInputRow} from '../../shared/DialogInputRow'
import {ScInput} from '../../shared/ScInput'
import {ScSelect} from '../../shared/Select/Select'

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
  } = useForm<CompaniesToImport>({
    defaultValues: {
      onlyHeadOffice: true,
      level: AccessLevel.ADMIN,
    },
  })
  const {api} = useApiContext()

  const mutation = useMutation({mutationFn: api.secured.company.importCompanies})

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
        <DialogTitle>Inviter manuellement des emails à des entreprises</DialogTitle>
        <DialogContent>
          <>
            <p className="mb-2">
              Cet outil permet d'ouvrir l'accès à des entreprises à certaines personnes,{' '}
              <span className="font-bold">en contournant ainsi l'invitation via courrier postal</span>. A utiliser lorsqu'un pro
              fait une demande au support en ce sens, et que vous avez vérifié manuellement (KBIS) que c'était bien le
              propriétaire de ces entreprises.
            </p>
            <p className="italic mb-4 text-gray-500">
              Les destinataires recevront une invitation à créer leur compte sur SignalConso, ou s'ils avaient déjà un compte, ils
              auront juste l'accès à ces nouvelles entreprises.
            </p>
          </>
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
          <DialogInputRow label="Siège social uniquement">
            <Controller
              name="onlyHeadOffice"
              control={control}
              render={({field: {ref, ...field}}) => <Checkbox checked={field.value} onChange={field.onChange} />}
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
          <DialogInputRow label="Droits d'accès">
            <Controller
              name="level"
              control={control}
              render={({field: {ref, ...field}}) => (
                <ScSelect value={field.value} onChange={field.onChange} fullWidth>
                  <MenuItem value={AccessLevel.ADMIN}>Administration</MenuItem>
                  <MenuItem value={AccessLevel.MEMBER}>Lecture seule</MenuItem>
                </ScSelect>
              )}
            />
          </DialogInputRow>
        </DialogContent>
        <DialogActions>
          <Btn onClick={close} color="primary">
            {m.close}
          </Btn>
          <Btn loading={mutation.isPending} onClick={confirm} color="primary" variant="contained">
            Importer
          </Btn>
        </DialogActions>
      </Dialog>
    </>
  )
}
