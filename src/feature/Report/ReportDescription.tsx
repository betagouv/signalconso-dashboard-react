import {useMutation, useQueryClient} from '@tanstack/react-query'
import {EventActionValues, ReportAction} from '../../core/client/event/Event'
import {FileOrigin, UploadedFile} from '../../core/client/file/UploadedFile'
import {Report} from '../../core/client/report/Report'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {Id} from '../../core/model'
import {GetReportQueryKeys} from '../../core/queryhooks/reportQueryHooks'
import {ReportFileDeleteButton} from './File/ReportFileDownloadAllButton'
import {ReportFiles} from './File/ReportFiles'

export function ReportDetails({report}: {report: Report}) {
  return (
    <div className="flex flex-col gap-2">
      {report.details.map((detail, i) => (
        <div key={i}>
          <p className="font-bold text-base" dangerouslySetInnerHTML={{__html: detail.label.replace(/:$/, '')}} />
          <p className="pl-4" dangerouslySetInnerHTML={{__html: `${detail.value}`}} />
        </div>
      ))}
    </div>
  )
}

export function ReportFilesFull({files, report}: {files: UploadedFile[] | undefined; report: Report}) {
  const {m} = useI18n()
  const {connectedUser, apiSdk} = useLogin()
  const queryClient = useQueryClient()

  const postAction = useMutation({
    mutationFn: (params: {id: Id; action: ReportAction}) => apiSdk.secured.reports.postAction(params.id, params.action),
    onSuccess: () => queryClient.invalidateQueries({queryKey: GetReportQueryKeys(report.id)}),
  })
  return (
    <>
      <div className="flex flex-row items-baseline">
        <h2 className="font-bold">{m.attachedFiles}</h2>
        {files && files.filter(_ => _.origin === FileOrigin.Consumer).length > 1 && (
          <ReportFileDeleteButton report={report} fileOrigin={FileOrigin.Consumer} />
        )}
      </div>
      <ReportFiles
        hideAddBtn={!connectedUser.isAdmin}
        files={files?.filter(_ => _.origin === FileOrigin.Consumer)}
        reportId={report.id}
        fileOrigin={FileOrigin.Consumer}
        onNewFile={file => {
          postAction.mutate({
            id: report.id,
            action: {
              details: '',
              fileIds: [file.id],
              actionType: EventActionValues.ConsumerAttachments,
            },
          })
        }}
      />
    </>
  )
}
