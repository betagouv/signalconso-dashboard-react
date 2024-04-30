import {useI18n} from '../../core/i18n'

import {Icon} from '@mui/material'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {
  AcceptedDetails,
  EventActionValues,
  NotConcernedDetails,
  RejectedDetails,
  EventUser,
  ReportAction,
  ReportProResponseEvent,
  ReportResponse,
  ReportResponseTypes,
  ResponseConsumerReview,
  ResponseEvaluation,
} from '../../core/client/event/Event'
import {FileOrigin, UploadedFile} from '../../core/client/file/UploadedFile'
import {useApiContext} from '../../core/context/ApiContext'
import {useConnectedContext} from '../../core/context/ConnectedContext'
import {Id, Report} from '../../core/model'
import {GetReportEventsQueryKeys} from '../../core/queryhooks/eventQueryHooks'
import {Divider} from '../../shared/Divider'
import {ReportFileDownloadAllButton} from './File/ReportFileDownloadAllButton'
import {ReportFiles} from './File/ReportFiles'
import {UserNameLabel} from '../../shared/UserNameLabel'

export function ReportResponseComponent({
  canEditFile,
  response,
  consumerReportReview,
  report,
  files,
}: {
  canEditFile?: boolean
  response: ReportProResponseEvent
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

  const details = response.data.details
  const expirationDate = new Date(response.data.creationDate)
  expirationDate.setDate(expirationDate.getDate() + 8)
  const user = response.user
  return (
    <div className="">
      {details ? <ResponseDetails {...{details, expirationDate, user}} /> : <div className="mt-2">{m.noAnswerFromPro}</div>}
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

function ResponseDetails({details, expirationDate, user}: {details: ReportResponse; expirationDate?: Date; user?: EventUser}) {
  const {m} = useI18n()
  return (
    <div>
      <ResponseType
        responseType={details.responseType}
        responseDetails={details.responseDetails}
        otherResponseDetails={details.otherResponseDetails}
        expirationDate={expirationDate}
      />
      <p className="font-bold">Répondant :</p>
      <div className="pl-4 mb-4">
        <UserNameLabel firstName={user?.firstName} lastName={user?.lastName} />
      </div>

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

function ResponseType({
  responseType,
  responseDetails,
  otherResponseDetails,
  expirationDate,
}: {
  responseType: ReportResponseTypes
  responseDetails: AcceptedDetails | RejectedDetails | NotConcernedDetails
  otherResponseDetails?: string
  expirationDate?: Date
}) {
  const {m, formatDate} = useI18n()
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

  const responseDetailsText =
    responseDetails === 'AUTRE'
      ? `${m.responseDetails[responseDetails]} : ${otherResponseDetails}`
      : m.responseDetails[responseDetails]

  const now = new Date()

  return (
    <div className="mb-4">
      <div className={`${color} mb-2 border-black border-solid border w-fit p-2`}>
        <p className={`flex items-center gap-1 font-bold`}>
          <Icon fontSize="small">{icon}</Icon>
          {text}
        </p>
        <p className={'pl-6 pt-2 italic'}>{responseDetailsText}</p>
      </div>
      {responseType === 'ACCEPTED' && (
        <>
          {expirationDate && expirationDate > now ? (
            <p>
              Nous demanderons son avis au consommateur le <strong>{formatDate(expirationDate)}</strong>
            </p>
          ) : (
            <p>
              Nous avons demandé son avis au consommateur le <strong>{formatDate(expirationDate)}</strong>
            </p>
          )}
        </>
      )}
    </div>
  )
}

function ConsumerReview({review}: {review: ResponseConsumerReview}) {
  const {m} = useI18n()
  const {connectedUser} = useConnectedContext()

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
