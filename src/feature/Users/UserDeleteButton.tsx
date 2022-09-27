import {Tooltip} from '@mui/material'
import {useEffect} from 'react'
import {Alert, Btn, Txt} from '../../alexlibs/mui-extension'
import {useUsersContext} from '../../core/context/UsersContext'
import {useI18n} from '../../core/i18n'

import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/Confirm/ScDialog'

interface Props {
  userId: string
  compact?: boolean
}

export const UserDeleteButton = ({userId, compact}: Props) => {
  const {m} = useI18n()
  const _softDelete = useUsersContext().softDelete
  const {toastError, toastSuccess} = useToast()
  const err = _softDelete.error

  useEffect(() => {
    if (err) {
      toastError(err)
    }
  }, [err, toastError])

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
          .fetch({}, userId)
          .then(_ => close())
          .then(_ => toastSuccess(m.userValidationDone))
      }}
      confirmLabel={m.delete_user}
    >
      <Tooltip title={m.delete_user}>
        <Btn loading={_softDelete.loading} sx={{color: t => t.palette.error.main}} icon="delete">
          {compact ? null : m.delete}
        </Btn>
      </Tooltip>
    </ScDialog>
  )
}
