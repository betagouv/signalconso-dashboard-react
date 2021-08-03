import React, {ReactElement, useState} from 'react'
import {Alert, Confirm} from 'mui-extension/lib'
import {EventActionValues, Report} from '../../core/api'
import {useI18n} from '../../core/i18n'
import {ScInput} from '../../shared/Input/ScInput'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {useLogin} from '../../core/context/LoginContext'
import {useToast} from '../../core/toast'

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
    <Confirm
      title={m.addDgccrfComment}
      loading={_addComment.loading}
      onConfirm={close => addComment().then(() => {
        setComment('')
        onAdd()
        toastSuccess(m.commentAdded)
        close()
      })}
      confirmLabel={m.add}
      cancelLabel={m.close}
      confirmDisabled={comment === ''}
      content={
        <>
          {_addComment.error && (
            <Alert type="error">{m.anErrorOccurred}</Alert>
          )}
          <ScInput
            required
            value={comment}
            onChange={e => setComment(e.target.value)}
            multiline
            fullWidth
            rows={3}
            maxRows={8}
          />
        </>
      }
    >
      {children}
    </Confirm>
  )
}
