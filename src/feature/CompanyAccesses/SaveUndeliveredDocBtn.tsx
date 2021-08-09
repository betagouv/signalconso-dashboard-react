import {ScButton} from '../../shared/Button/Button'
import {useI18n} from '../../core/i18n'
import React, {useState} from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {Roles} from '../../core/api'
import {Confirm} from 'mui-extension/lib'
import {Datepicker} from '../../shared/Datepicker/Datepicker'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {useToast} from '../../core/toast'

interface Props {
  loading: boolean
  className?: string
  onChange: (date: Date) => Promise<any>
}

export const SaveUndeliveredDocBtn = ({loading, onChange, className}: Props) => {
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const {connectedUser} = useLogin()
  const {toastSuccess} = useToast()
  const [returnDate, setReturnDate] = useState(new Date())

  if (!connectedUser.isAdmin) {
    return <></>
  }
  return (
    <Confirm
      title={m.undeliveredDocTitle}
      cancelLabel={m.close}
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
            className={cssUtils.marginRight}
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
    </Confirm>
  )
}
