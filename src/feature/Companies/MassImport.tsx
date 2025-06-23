import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { translateAccessLevel } from 'core/model'
import React, { ReactElement, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Btn } from '../../alexlibs/mui-extension'
import {
  AccessLevel,
  CompaniesToImport,
} from '../../core/client/company/Company'
import { useApiContext } from '../../core/context/ApiContext'
import { useToast } from '../../core/context/toast/toastContext'
import { useI18n } from '../../core/i18n'
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

          <div className="flex flex-col">
            <div className="flex items-baseline gap-4">
              <span className="flex-1/4 text-right text-gray-600">SIREN</span>
              <ScInput
                sx={{ flexBasis: '75%' }}
                placeholder="SIREN"
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
            </div>
            <div className="flex justify-end items-center gap-4 mb-2">
              <Controller
                name="onlyHeadOffice"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <Checkbox
                    slotProps={{
                      input: { 'aria-labelledby': 'siege_social_uniquement' },
                    }}
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <div className="w-[70%] flex flex-col">
                <span className="text-gray-600">
                  Ajouter au siège social uniquement
                </span>
                <span className="text-gray-500 italic">
                  L'utilisateur ne sera pas ajouté sur les autres SIRETs de ce
                  SIREN automatiquement
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="flex-1/4 text-right text-gray-600">SIRETs</span>
              <ScInput
                sx={{ flexBasis: '75%' }}
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
            </div>

            <div className="flex items-baseline gap-4">
              <span className="flex-1/4 text-right text-gray-600">Emails</span>
              <ScInput
                sx={{ flexBasis: '75%' }}
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
            </div>
            <div className="flex items-baseline gap-4">
              <span className="flex-1/4 text-right text-gray-600">
                Niveau d'accès
              </span>
              <Controller
                name="level"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <ScSelect
                    style={{ flexBasis: '75%' }}
                    label="Niveau"
                    value={field.value}
                    onChange={field.onChange}
                    fullWidth
                  >
                    {[AccessLevel.ADMIN, AccessLevel.MEMBER].map((l) => (
                      <MenuItem key={l} value={l}>
                        {translateAccessLevel(l)}
                      </MenuItem>
                    ))}
                  </ScSelect>
                )}
              />
            </div>
          </div>
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
