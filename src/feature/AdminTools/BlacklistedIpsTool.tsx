import {CleanWidePanel} from '../../shared/Panel/simplePanels'
import React, {ReactElement} from 'react'
import {ListIpBlacklistQueryKeys, useListIpBlacklistQuery} from '../../core/queryhooks/ipBlacklistQueryHooks'
import {Datatable} from '../../shared/Datatable/Datatable'
import {BlacklistedIp} from '../../core/client/ip-blacklist/BlacklistedIp'
import {IconBtn} from '../../alexlibs/mui-extension'
import {Box, Checkbox, Icon, Tooltip} from '@mui/material'
import {useI18n} from '../../core/i18n'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useConnectedContext} from '../../core/context/ConnectedContext'
import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/ScDialog'
import {Controller, useForm} from 'react-hook-form'
import {ScInput} from '../../shared/ScInput'

export const BlacklistedIpsTool = () => {
  const {m} = useI18n()
  const {apiSdk} = useConnectedContext()
  const queryClient = useQueryClient()
  const {toastSuccess} = useToast()

  const blacklist = useListIpBlacklistQuery()

  const _remove = useMutation({
    mutationFn: apiSdk.secured.ipBlacklist.delete,
    onSuccess: () => {
      toastSuccess('IP supprimée')
      return queryClient.invalidateQueries({queryKey: ListIpBlacklistQueryKeys})
    },
  })

  return (
    <CleanWidePanel>
      <h2 className="font-bold text-lg mb-2">Gestion des ip blacklistées</h2>
      <Datatable<BlacklistedIp>
        actions={
          <AddIp>
            <IconBtn color="primary">
              <Icon>add</Icon>
            </IconBtn>
          </AddIp>
        }
        data={blacklist.data}
        columns={[
          {
            id: 'ip',
            head: 'IP',
            render: blacklistedId => blacklistedId.ip,
          },
          {
            id: 'comment',
            head: 'Commentaire',
            render: blacklistedId => blacklistedId.comment,
          },
          {
            id: 'critical',
            head: 'Criticité',
            render: blacklistedId => blacklistedId.critical && <Icon color="warning">warning</Icon>,
          },
          {
            id: 'action',
            stickyEnd: true,
            render: _ => (
              <div className="flex justify-end">
                <Tooltip title={m.delete}>
                  <IconBtn loading={_remove.isPending} color="primary" onClick={() => _remove.mutateAsync(_.ip)}>
                    <Icon>delete</Icon>
                  </IconBtn>
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

const AddIp = ({children}: AddIpProps) => {
  const {apiSdk} = useConnectedContext()
  const queryClient = useQueryClient()
  const {toastSuccess} = useToast()
  const {m} = useI18n()
  const {
    register,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<AddIpForm>()

  const _add = useMutation({
    mutationFn: ({ip, comment, critical}: {ip: string; comment: string; critical: boolean}) =>
      apiSdk.secured.ipBlacklist.add(ip, comment, critical),
    onSuccess: () => {
      toastSuccess('IP ajoutée')
      return queryClient.invalidateQueries({queryKey: ListIpBlacklistQueryKeys})
    },
  })

  return (
    <ScDialog
      maxWidth="sm"
      title="Bannir une IP"
      content={close => (
        <>
          <ScInput
            error={!!errors.ip}
            helperText={errors.ip?.message ?? ' '}
            fullWidth
            placeholder="Adresse IP (v4 ou v6)"
            {...register('ip', {
              required: {value: true, message: m.required},
            })}
          />
          <ScInput
            error={!!errors.comment}
            helperText={errors.comment?.message ?? ' '}
            fullWidth
            placeholder="Commentaire"
            {...register('comment', {
              required: {value: true, message: m.required},
            })}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box sx={{color: t => t.palette.text.secondary}}>Critique</Box>
            <Controller
              name="critical"
              control={control}
              render={({field: {ref, ...field}}) => <Checkbox checked={field.value} onChange={field.onChange} />}
            />
          </Box>
        </>
      )}
      onConfirm={(e, close) => {
        handleSubmit((form: AddIpForm) => {
          const {ip, comment, critical}: AddIpForm = form
          _add.mutate({ip, comment, critical: critical ?? false})
          close()
        })(e)
      }}
      confirmLabel={m.validate}
    >
      {children}
    </ScDialog>
  )
}
