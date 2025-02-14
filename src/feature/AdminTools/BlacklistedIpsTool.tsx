import { Box, Checkbox, Icon, Tooltip } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BlacklistedIp } from '../../core/client/ip-blacklist/BlacklistedIp'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useToast } from '../../core/context/toastContext'
import { useI18n } from '../../core/i18n'
import {
  ListIpBlacklistQueryKeys,
  useListIpBlacklistQuery,
} from '../../core/queryhooks/ipBlacklistQueryHooks'
import { ScButton } from '../../shared/Button'
import { Datatable } from '../../shared/Datatable/Datatable'
import { CleanWidePanel } from '../../shared/Panel/simplePanels'
import { ScDialog } from '../../shared/ScDialog'
import { ScInput } from '../../shared/ScInput'

export const BlacklistedIpsTool = () => {
  const { m } = useI18n()
  const { api: apiSdk } = useConnectedContext()
  const queryClient = useQueryClient()
  const { toastSuccess } = useToast()

  const blacklist = useListIpBlacklistQuery()

  const _remove = useMutation({
    mutationFn: apiSdk.secured.ipBlacklist.delete,
    onSuccess: () => {
      toastSuccess('IP supprimée')
      return queryClient.invalidateQueries({
        queryKey: ListIpBlacklistQueryKeys,
      })
    },
  })

  return (
    <CleanWidePanel>
      <h2 className="font-bold text-lg mb-2">Gestion des ip blacklistées</h2>
      <Datatable<BlacklistedIp>
        id="blacklistedips"
        superheader={
          <>
            <p>Une IP bannie sera systématiquement rejetée par l'API.</p>
            <p>
              Une IP critique (marquée par le symbole{' '}
              <Icon color="warning">warning</Icon>) entraine un log en warning
              spécial pour pouvoir identifier facilement toute tentative
              d'accès. On marque une IP comme critique lorsque celle-ci est
              identifiée comme malveillante.
            </p>
            <p className="mt-4">
              Un redémarrage de l'API est nécessaire pour prendre en compte
              toute modification de la liste.
            </p>
          </>
        }
        actions={
          <AddIp>
            <ScButton color="primary" icon="add" variant="contained">
              Ajouter une IP
            </ScButton>
          </AddIp>
        }
        data={blacklist.data}
        columns={[
          {
            id: 'ip',
            head: 'IP',
            render: (blacklistedId) => blacklistedId.ip,
          },
          {
            id: 'comment',
            head: 'Commentaire',
            render: (blacklistedId) => (
              <Tooltip title={blacklistedId.comment}>
                <Box
                  sx={{
                    maxWidth: '500px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {blacklistedId.comment}
                </Box>
              </Tooltip>
            ),
          },
          {
            id: 'critical',
            head: 'Criticité',
            render: (blacklistedId) =>
              blacklistedId.critical && <Icon color="warning">warning</Icon>,
          },
          {
            id: 'action',
            stickyEnd: true,
            render: (_) => (
              <div className="flex justify-end">
                <Tooltip title={m.delete}>
                  <ScButton
                    loading={_remove.isPending}
                    color="error"
                    onClick={() => _remove.mutateAsync(_.ip)}
                    icon="delete"
                    variant="outlined"
                  >
                    Supprimer
                  </ScButton>
                </Tooltip>
              </div>
            ),
          },
        ]}
      />
    </CleanWidePanel>
  )
}

interface AddIpProps {
  children: ReactElement<any>
}

interface AddIpForm {
  ip: string
  comment: string
  critical: boolean
}

const AddIp = ({ children }: AddIpProps) => {
  const { api: apiSdk } = useConnectedContext()
  const queryClient = useQueryClient()
  const { toastSuccess } = useToast()
  const { m } = useI18n()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddIpForm>()

  const _add = useMutation({
    mutationFn: ({
      ip,
      comment,
      critical,
    }: {
      ip: string
      comment: string
      critical: boolean
    }) => apiSdk.secured.ipBlacklist.add(ip, comment, critical),
    onSuccess: () => {
      toastSuccess('IP ajoutée')
      return queryClient.invalidateQueries({
        queryKey: ListIpBlacklistQueryKeys,
      })
    },
  })

  const checkIpAddress = (ip: string): boolean => {
    // IPv4 with or without subnet mask
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/
    // IPv6 without subnet mask (we could add it)
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip)
  }

  return (
    <ScDialog
      maxWidth="sm"
      title="Bannir une IP"
      content={(close) => (
        <>
          <ScInput
            error={!!errors.ip}
            helperText={errors.ip?.message ?? ' '}
            fullWidth
            placeholder="Adresse IP (v4 ou v6)"
            {...register('ip', {
              validate: (ip) => checkIpAddress(ip) || 'Adresse IP invalide',
            })}
          />
          <ScInput
            error={!!errors.comment}
            helperText={errors.comment?.message ?? ' '}
            fullWidth
            placeholder="Commentaire"
            {...register('comment', {
              required: { value: true, message: m.required },
            })}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box sx={{ color: (t) => t.palette.text.secondary }}>Critique</Box>
            <Controller
              name="critical"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Checkbox checked={field.value} onChange={field.onChange} />
              )}
            />
          </Box>
        </>
      )}
      onConfirm={(e, close) => {
        handleSubmit((form: AddIpForm) => {
          const { ip, comment, critical }: AddIpForm = form
          _add.mutate({ ip, comment, critical: critical ?? false })
          close()
        })(e)
      }}
      confirmLabel={m.validate}
    >
      {children}
    </ScDialog>
  )
}
