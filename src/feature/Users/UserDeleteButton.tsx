import {Tooltip} from '@mui/material'
import {Alert, Btn, Txt} from '../../alexlibs/mui-extension'
import {useI18n} from '../../core/i18n'

import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/ScDialog'
import {useMutation} from '@tanstack/react-query'
import {useApiContext} from '../../core/context/ApiContext'

interface Props {
  userId: string
  compact?: boolean
  onDelete?: () => void
}

export const UserDeleteButton = ({userId, compact, onDelete = () => {}}: Props) => {
  const {m} = useI18n()
  const {api} = useApiContext()
  const _softDelete = useMutation({
    mutationFn: api.secured.user.softDelete,
  })
  const {toastSuccess} = useToast()

  const dialogContent = (
    <>
      <Txt bold>{m.delete_user_desc_main}</Txt>
      <Alert type="warning" sx={{mb: 2, mt: 2}} dense>
        <Txt bold>{m.operation_irreversible}</Txt>
      </Alert>
      {m.delete_user_desc_details}
    </>
  )

  return (
    <ScDialog
      title={m.delete_user_ask}
      content={dialogContent}
      onConfirm={(event, close) => {
        _softDelete
          .mutateAsync(userId)
          .then(_ => close())
          .then(_ => toastSuccess(m.delete_user_done))
          .then(_ => onDelete())
      }}
      confirmLabel={m.delete_user}
    >
      <Tooltip title={m.delete_user}>
        <Btn loading={_softDelete.isPending} sx={{color: t => t.palette.error.main}} icon="delete">
          {compact ? null : m.delete}
        </Btn>
      </Tooltip>
    </ScDialog>
  )
}
