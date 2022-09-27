import {Icon, Tooltip} from '@mui/material'
import {useEffect} from 'react'
import {Btn, IconBtn} from '../../alexlibs/mui-extension'
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

  return (
    <ScDialog
      title={m.removeAsk}
      content={'attention delete irreversible bla bla'}
      onConfirm={(event, close) => {
        _softDelete
          .fetch({}, userId)
          .then(_ => close())
          .then(_ => toastSuccess(m.userValidationDone))
      }}
    >
      <Tooltip title={'delete user'}>
        <Btn loading={_softDelete.loading} sx={{color: t => t.palette.error.main}} icon="delete">
          {compact ? null : m.delete}
        </Btn>
      </Tooltip>
    </ScDialog>
  )
}
