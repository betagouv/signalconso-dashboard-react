import {ScButton} from '../../shared/Button/Button'
import {useI18n} from '../../core/i18n'
import React, {useState} from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {Datepicker} from '../../shared/Datepicker/Datepicker'
import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/Confirm/ScDialog'

interface Props {
  loading: boolean
  className?: string
  onChange: (date: Date) => Promise<any>
}

export const SaveUndeliveredDocBtn = ({loading, onChange, className}: Props) => {
  const {m} = useI18n()
  const {connectedUser} = useLogin()
  const {toastSuccess} = useToast()
  const [returnDate, setReturnDate] = useState(new Date())

  if (!connectedUser.isAdmin) {
    return <></>
  }
  return (
    <ScDialog
      title={m.undeliveredDocTitle}
      loading={loading}
      confirmLabel={m.confirm}
      confirmDisabled={!returnDate}
      onConfirm={(event, close) =>
        onChange(returnDate)
          .then(() => toastSuccess(m.changesSaved))
          .then(close)
      }
      content={
        <>
          <Datepicker
            sx={{mr: 1}}
            fullWidth
            label={m.returnDate}
            value={returnDate}
            onChange={setReturnDate}
          />
        </>
      }
    >
      <ScButton variant="outlined" className={className} icon="cancel_schedule_send" color="primary">
        {m.undeliveredDoc}
      </ScButton>
    </ScDialog>
  )
}
