import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import React, { ReactElement, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Btn } from '../../alexlibs/mui-extension'
import {
  AccessLevel,
  CompaniesToImport,
} from '../../core/client/company/Company'
import { useApiContext } from '../../core/context/ApiContext'
import { useI18n } from '../../core/i18n'
import { useToast } from '../../core/toast'
import { DialogInputRow } from '../../shared/DialogInputRow'
import { ScInput } from '../../shared/ScInput'
import { ScSelect } from '../../shared/Select/Select'

interface MassImportProps {
  children: ReactElement<any>
}

interface MassImportForm {
  siren?: string
  sirets: string
  emails: string
  onlyHeadOffice: boolean
  level: AccessLevel
}

export const MassImport = ({ children }: MassImportProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const { m } = useI18n()
  const { toastError, toastSuccess } = useToast()
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<MassImportForm>({
    defaultValues: {
      onlyHeadOffice: true,
      level: AccessLevel.ADMIN,
    },
  })
  const { api } = useApiContext()

  const mutation = useMutation({
    mutationFn: api.secured.company.importCompanies,
  })

  const close = () => {
    setOpen(false)
  }

  const confirm = (e: any) => {
    handleSubmit((_) => {
      if (!_.siren && !_.sirets) {
        setError('sirets', {
          type: 'manual',
          message: 'Le siren ou au moins un siret doit être renseigné',
        })
        setError('siren', {
          type: 'manual',
          message: 'Le siren ou au moins un siret doit être renseigné',
        })
        return
      }
      const companiesToImport: CompaniesToImport = {
        siren: _.siren,
        sirets: _.sirets.split(','),
        emails: _.emails.split(','),
        onlyHeadOffice: _.onlyHeadOffice,
        level: _.level,
      }
      mutation.mutate(companiesToImport)
      toastSuccess('Opération réussie')
      close()
    })(e)
  }

  return (
    <>
      {React.cloneElement(children, {
        onClick: (event: any) => {
          setOpen(true)
        },
      })}
      <Dialog fullWidth open={open ?? false} onClose={close}>
        <DialogTitle>Ouvrir manuellement l'accès à des entreprises</DialogTitle>
        <DialogContent>
          <>
            <p className="mb-2">
              Cet outil permet d'ouvrir l'accès à des entreprises à certaines
              personnes,{' '}
              <span className="font-bold">
                en contournant ainsi l'invitation via courrier postal
              </span>
              . A utiliser lorsqu'un pro fait une demande au support en ce sens,
              et que vous avez vérifié manuellement (KBIS) que c'était bien le
              propriétaire de ces entreprises.
            </p>
            <p className="italic mb-2 text-gray-500">
              Les entreprises seront créées dans SignalConso, si elles
              n'existaient pas. Les destinataires recevront une invitation à
              créer leur compte sur SignalConso, ou s'ils avaient déjà un
              compte, ils auront juste l'accès à ces nouvelles entreprises.
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
              render={({ field: { ref, ...field } }) => (
                <Checkbox checked={field.value} onChange={field.onChange} />
              )}
            />
          </DialogInputRow>
          <DialogInputRow label="SIRETs">
            <ScInput
              placeholder="Liste de sirets séparés par des virgules"
              error={!!errors.sirets}
              helperText={errors.sirets?.message ?? ' '}
              fullWidth
              {...register('sirets', {
                validate: (value) =>
                  !value ||
                  value.split(',').every((_) => _.match(/^[0-9]{14}$/)) ||
                  'Un des SIRETs est invalide',
              })}
            />
          </DialogInputRow>
          <DialogInputRow label="Emails">
            <ScInput
              placeholder="Liste d'emails séparés par des virgules"
              error={!!errors.emails}
              helperText={errors.emails?.message ?? ' '}
              fullWidth
              {...register('emails', {
                validate: (value) =>
                  value.split(',').every((_) => _.match(/.+@.+\..+/)) ||
                  'Un des emails est invalide',
              })}
            />
          </DialogInputRow>
          <DialogInputRow label="Droits d'accès">
            <Controller
              name="level"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <ScSelect
                  value={field.value}
                  onChange={field.onChange}
                  fullWidth
                >
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
          <Btn
            loading={mutation.isPending}
            onClick={confirm}
            color="primary"
            variant="contained"
          >
            Envoyer
          </Btn>
        </DialogActions>
      </Dialog>
    </>
  )
}
