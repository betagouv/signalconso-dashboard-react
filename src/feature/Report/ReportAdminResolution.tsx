import React, {ReactElement, useState} from 'react'
import {Alert} from '../../alexlibs/mui-extension'
import {useI18n} from '../../core/i18n'
import {ScInput} from '../../shared/ScInput'
import {useFetcher} from '../../alexlibs/react-hooks-lib'
import {useLogin} from '../../core/context/LoginContext'
import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/ScDialog'
import {Report, ReportAdminActionType} from '../../core/client/report/Report'
import {ScRadioGroup} from '../../shared/RadioGroup'
import {Enum} from '../../alexlibs/ts-utils'
import {ScRadioGroupItem} from '../../shared/RadioGroupItem'

interface Props {
  report: Report
  children: ReactElement<any>
  onAdd: () => void
  label: string
}

export const ReportAdminResolution = ({label, report, children, onAdd}: Props) => {
  const {m} = useI18n()
  const {apiSdk} = useLogin()
  const _removeReport = useFetcher(apiSdk.secured.reports.remove)
  const [comment, setComment] = useState('')
  const [deletionType, setDeletionType] = useState<ReportAdminActionType | undefined>(undefined)
  const {toastSuccess} = useToast()

  const performAdminAction = (reportAdminActionType: ReportAdminActionType) => {
    return _removeReport.fetch({}, report.id, {reportAdminActionType, comment})
  }

  return (
    <ScDialog
      title={label}
      loading={_removeReport.loading}
      onConfirm={(event, close) =>
        deletionType &&
        performAdminAction(deletionType).then(() => {
          setComment('')
          onAdd()
          toastSuccess(m.actionDone)
          close()
        })
      }
      confirmLabel={m.validate}
      confirmDisabled={deletionType === undefined}
      content={
        <>
          {_removeReport.error && <Alert type="error">{m.anErrorOccurred}</Alert>}

          <Alert id="action-info" dense type="info" className={'mb-4 mt-3'}>
            Quelle que soit l'action choisie, nous créerons un évènement dans notre base de données, associé à l'identifiant de
            l'entreprise, afin de garder une trace de cette situation.
          </Alert>

          <b>Selection du type d'action :</b>
          <ScRadioGroup
            className={'mb-10 mt-3'}
            value={deletionType}
            onChange={reportDeletionType => {
              setDeletionType(reportDeletionType)
            }}
          >
            {Enum.keys(ReportAdminActionType).map(reportDeletionType => (
              <ScRadioGroupItem
                title={m.reportDeletionTypeName[ReportAdminActionType[reportDeletionType]]}
                description={m.reportDeletionTypeDescription[ReportAdminActionType[reportDeletionType]]}
                value={reportDeletionType}
                key={reportDeletionType}
              />
            ))}
          </ScRadioGroup>
          <b className={'mt-10 mb-10'}>Commentaire :</b>
          <ScInput value={comment} onChange={e => setComment(e.target.value)} multiline fullWidth rows={3} maxRows={8} />
        </>
      }
    >
      {children}
    </ScDialog>
  )
}
