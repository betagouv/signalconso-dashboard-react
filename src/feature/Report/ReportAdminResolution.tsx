import { useMutation } from '@tanstack/react-query'
import { objectKeysUnsafe } from 'core/helper'
import { ReactElement, useState } from 'react'
import { Alert } from '../../alexlibs/mui-extension'
import {
  Report,
  ReportAdminActionType,
  ReportDeletionReason,
  ReportStatus,
} from '../../core/client/report/Report'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useToast } from '../../core/context/toastContext'
import { useI18n } from '../../core/i18n'
import { Id } from '../../core/model'
import { ScRadioGroup } from '../../shared/RadioGroup'
import { ScRadioGroupItem } from '../../shared/RadioGroupItem'
import { ScDialog } from '../../shared/ScDialog'
import { ScInput } from '../../shared/ScInput'

interface Props {
  report: Report
  children: ReactElement<any>
  onAdd: () => void
  label: string
}

export const ReportAdminResolution = ({
  label,
  report,
  children,
  onAdd,
}: Props) => {
  const { m } = useI18n()
  const { api: apiSdk } = useConnectedContext()
  const _removeReport = useMutation({
    mutationFn: (params: {
      id: Id
      reportDeletionReason: ReportDeletionReason
    }) => apiSdk.secured.reports.remove(params.id, params.reportDeletionReason),
    onSuccess: () => {
      setComment('')
      onAdd()
      toastSuccess(m.actionDone)
      window.history.back()
    },
  })
  const [comment, setComment] = useState('')
  const [deletionType, setDeletionType] = useState<
    ReportAdminActionType | undefined
  >(undefined)
  const { toastSuccess } = useToast()

  const performAdminAction = (reportAdminActionType: ReportAdminActionType) => {
    return _removeReport.mutateAsync({
      id: report.id,
      reportDeletionReason: { reportAdminActionType, comment },
    })
  }

  const keys =
    report.status === ReportStatus.PromesseAction
      ? objectKeysUnsafe(ReportAdminActionType).filter(
          (_) => _ !== ReportAdminActionType.SolvedContractualDispute,
        )
      : objectKeysUnsafe(ReportAdminActionType)

  return (
    <ScDialog
      title={label}
      loading={_removeReport.isPending}
      onConfirm={(event, close) =>
        deletionType && performAdminAction(deletionType).finally(close)
      }
      confirmLabel={m.validate}
      confirmDisabled={deletionType === undefined || comment === ''}
      content={
        <>
          {_removeReport.error && (
            <Alert type="error">{m.anErrorOccurred}</Alert>
          )}

          <Alert id="action-info" dense type="info" className={'mb-4 mt-3'}>
            Quelle que soit l'action choisie, nous créerons un évènement dans
            notre base de données, associé à l'identifiant de l'entreprise, afin
            de garder une trace de cette situation.
          </Alert>

          <b>Selection du type d'action :</b>
          <ScRadioGroup
            className={'mb-10 mt-3'}
            value={deletionType}
            onChange={(reportDeletionType) => {
              setDeletionType(reportDeletionType)
            }}
          >
            {keys.map((reportDeletionType) => (
              <ScRadioGroupItem
                title={
                  m.reportDeletionTypeName[
                    ReportAdminActionType[reportDeletionType]
                  ]
                }
                description={
                  m.reportDeletionTypeDescription[
                    ReportAdminActionType[reportDeletionType]
                  ]
                }
                value={reportDeletionType}
                key={reportDeletionType}
              />
            ))}
          </ScRadioGroup>
          <b className={'mt-10 mb-10'}>Commentaire (Obligatoire) :</b>
          <ScInput
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
