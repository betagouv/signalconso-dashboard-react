import { useMutation } from '@tanstack/react-query'
import { ReactElement, useState } from 'react'
import { Alert } from '../../alexlibs/mui-extension'
import { EventActionValues, ReportAction } from '../../core/client/event/Event'
import { Report } from '../../core/client/report/Report'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useToast } from '../../core/context/toastContext'
import { useI18n } from '../../core/i18n'
import { Id } from '../../core/model'
import { ScDialog } from '../../shared/ScDialog'
import { ScInput } from '../../shared/ScInput'

interface Props {
  report: Report
  children: ReactElement<any>
  onAdd: () => void
  required?: boolean
  label: string
  actionType: EventActionValues
}

export const ReportPostAction = ({
  label,
  actionType,
  report,
  children,
  onAdd,
  required,
}: Props) => {
  const { m } = useI18n()
  const { apiSdk } = useConnectedContext()
  const _addComment = useMutation({
    mutationFn: (params: { id: Id; action: ReportAction }) =>
      apiSdk.secured.reports.postAction(params.id, params.action),
    onSuccess: () => {
      setComment('')
      onAdd()
      toastSuccess(m.commentAdded)
    },
  })
  const [comment, setComment] = useState('')
  const { toastSuccess } = useToast()

  return (
    <ScDialog
      title={label}
      loading={_addComment.isPending}
      onConfirm={(event, close) =>
        _addComment
          .mutateAsync({
            id: report.id,
            action: { actionType, details: comment, fileIds: [] },
          })
          .finally(close)
      }
      confirmLabel={m.add}
      confirmDisabled={required && comment === ''}
      content={
        <>
          {_addComment.error && <Alert type="error">{m.anErrorOccurred}</Alert>}
          <ScInput
            required={required}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            fullWidth
            rows={3}
            maxRows={8}
          />
        </>
      }
    >
      {children}
    </ScDialog>
  )
}
