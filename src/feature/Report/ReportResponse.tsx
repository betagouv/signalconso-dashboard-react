import {useI18n} from '../../core/i18n'

import {Icon} from '@mui/material'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {
  EventActionValues,
  ReportAction,
  ReportProResponseEvent,
  ReportResponse,
  ReportResponseTypes,
  ResponseConsumerReview,
  ResponseEvaluation,
} from '../../core/client/event/Event'
import {FileOrigin, UploadedFile} from '../../core/client/file/UploadedFile'
import {useApiContext} from '../../core/context/ApiContext'
import {useLogin} from '../../core/context/LoginContext'
import {Id, Report} from '../../core/model'
import {GetReportEventsQueryKeys} from '../../core/queryhooks/eventQueryHooks'
import {Divider} from '../../shared/Divider'
import {ReportFileDownloadAllButton} from './File/ReportFileDownloadAllButton'
import {ReportFiles} from './File/ReportFiles'

export function ReportResponseComponent({
  canEditFile,
  response,
  consumerReportReview,
  report,
  files,
}: {
  canEditFile?: boolean
  response: ReportProResponseEvent['data']
  consumerReportReview?: ResponseConsumerReview
  report: Report
  files?: UploadedFile[]
}) {
  const {m} = useI18n()
  const {api} = useApiContext()
  const queryClient = useQueryClient()
  const _postAction = useMutation({
    mutationFn: (params: {id: Id; action: ReportAction}) => api.secured.reports.postAction(params.id, params.action),
    onSuccess: () => queryClient.invalidateQueries({queryKey: GetReportEventsQueryKeys(report.id)}),
  })

  const details = response.details
  return (
    <div className="">
      {details ? <ResponseDetails {...{details}} /> : <div className="mt-2">{m.noAnswerFromPro}</div>}
      <div className="flex flex-row mt-5 ">
        <h2 className="font-bold">{m.attachedFiles}</h2>
        {files && files.filter(_ => _.origin === FileOrigin.Professional).length > 1 && (
          <ReportFileDownloadAllButton report={report} fileOrigin={FileOrigin.Professional} />
        )}
      </div>
      <ReportFiles
        hideAddBtn={!canEditFile}
        reportId={report.id}
        files={files}
        fileOrigin={FileOrigin.Professional}
        onNewFile={file => {
          _postAction.mutate({
            id: report.id,
            action: {
              details: '',
              fileIds: [file.id],
              actionType: EventActionValues.ProfessionalAttachments,
            },
          })
        }}
      />
      <Divider margin />
      <>
        {consumerReportReview ? (
          <ConsumerReview review={consumerReportReview} />
        ) : (
          <div className="">{m.noReviewFromConsumer}</div>
        )}
      </>
    </div>
  )
}

function ResponseDetails({details}: {details: ReportResponse}) {
  const {m} = useI18n()
  return (
    <div>
      <ResponseType responseType={details.responseType} />
      <p className="font-bold">Réponse communiquée au consommateur :</p>
      <div className="pl-4">{details.consumerDetails}</div>

      {details.dgccrfDetails && details.dgccrfDetails !== '' && (
        <>
          <p className="font-bold">{m.reportDgccrfDetails}</p>
          <div className="pl-4">{details.dgccrfDetails}</div>
        </>
      )}
    </div>
  )
}

function ResponseType({responseType}: {responseType: ReportResponseTypes}) {
  const {m} = useI18n()
  const {icon, color, text} = (() => {
    switch (responseType) {
      case ReportResponseTypes.Accepted:
        return {icon: 'done', color: 'bg-green-100', text: m.reportResponse.ACCEPTED}
      case ReportResponseTypes.NotConcerned:
        return {icon: 'domain_disabled', color: 'bg-blue-100', text: m.reportResponse.NOT_CONCERNED}
      case ReportResponseTypes.Rejected:
        return {icon: 'error_outline', color: 'bg-orange-100', text: m.reportResponse.REJECTED}
    }
  })()
  return (
    <p className={`flex items-center gap-1 w-fit p-2 ${color} mb-4 border-black border-solid border`}>
      <Icon fontSize="small">{icon}</Icon>
      {text}
    </p>
  )
}

function ConsumerReview({review}: {review: ResponseConsumerReview}) {
  const {m} = useI18n()
  const {connectedUser} = useLogin()

  const {icon, classes, text} = (() => {
    switch (review.evaluation) {
      case ResponseEvaluation.Positive:
        return {
          icon: 'sentiment_satisfied_alt',
          classes: 'bg-green-100 text-green-800 border-green-800',
          text: m.responseEvaluation.Positive,
        }
      case ResponseEvaluation.Neutral:
        return {
          icon: 'sentiment_neutral',
          classes: 'bg-gray-100 text-gray-800 border-gray-800',
          text: m.responseEvaluation.Neutral,
        }
      case ResponseEvaluation.Negative:
        return {
          icon: 'sentiment_dissatisfied',
          classes: 'bg-red-100 text-red-800 border-red-800',
          text: m.responseEvaluation.Negative,
        }
    }
  })()

  return (
    <div>
      <h3 className="font-bold text-xl mb-2">Avis du consommateur sur cette réponse :</h3>
      <p className={`inline-flex rounded-full items-center gap-1 w-fit p-2 ${classes} font-normal border border-solid`}>
        <Icon fontSize="medium">{icon}</Icon>
        {text}
      </p>
      {connectedUser.isNotPro && (
        <>
          {review.details ? (
            <div className="pl-4">{review.details}</div>
          ) : (
            <div className="">{m.noReviewDetailsFromConsumer}</div>
          )}
        </>
      )}
    </div>
  )
}
