import React, {ReactElement, useState} from 'react'
import {Alert, Confirm} from 'mui-extension/lib'
import {EventActionValues, Report} from '../../core/api'
import {useI18n} from '../../core/i18n'
import {ScInput} from '../../shared/Input/ScInput'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {useLogin} from '../../core/context/LoginContext'
import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/Confirm/ScDialog'

interface Props {
  report: Report
  children: ReactElement<any>
  onAdd: () => void
}

export const ReportAddComment = ({report, children, onAdd}: Props) => {
  const {m} = useI18n()
  const {apiSdk} = useLogin()
  const _addComment = useFetcher(apiSdk.secured.reports.postAction)
  const [comment, setComment] = useState('')
  const {toastSuccess} = useToast()

  const addComment = () => {
    return _addComment.fetch({}, report.id, {actionType: EventActionValues.Comment, details: comment, fileIds: []})
  }

  return (
    <ScDialog
      title={m.addDgccrfComment}
      loading={_addComment.loading}
      onConfirm={(event, close) =>
        addComment().then(() => {
          setComment('')
          onAdd()
          toastSuccess(m.commentAdded)
          close()
        })
      }
      confirmLabel={m.add}
      confirmDisabled={comment === ''}
      content={
        <>
          {_addComment.error && <Alert type="error">{m.anErrorOccurred}</Alert>}
          <ScInput required value={comment} onChange={e => setComment(e.target.value)} multiline fullWidth rows={3} maxRows={8} />
        </>
      }
    >
      {children}
    </ScDialog>
  )
}
