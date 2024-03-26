import {Icon} from '@mui/material'
import {useQueryClient} from '@tanstack/react-query'
import {siteMap} from 'core/siteMap'
import {ReportReferenceNumber} from 'feature/Report/ReportReferenceNumber'
import {useRef} from 'react'
import {useParams} from 'react-router'
import {Link} from 'react-router-dom'
import {CleanWidePanel} from 'shared/Panel/simplePanels'
import {ReportProResponseEvent, ResponseConsumerReview} from '../../core/client/event/Event'
import {FileOrigin, UploadedFile} from '../../core/client/file/UploadedFile'
import {Report, ReportSearchResult, ReportStatusPro} from '../../core/client/report/Report'
import {capitalize} from '../../core/helper'
import {useI18n} from '../../core/i18n'
import {Id} from '../../core/model'
import {GetReportEventsQueryKeys, useGetReportEventsQuery} from '../../core/queryhooks/eventQueryHooks'
import {GetReportQueryKeys, useGetReportQuery, useGetReviewOnReportResponseQuery} from '../../core/queryhooks/reportQueryHooks'
import {ScButton} from '../../shared/Button'
import {Page} from '../../shared/Page'
import {ReportEvents} from './Event/ReportEvents'
import {creationReportEvent} from './Report'
import {ReportAssignement} from './ReportAssignement'
import {ReportDetails, ReportFilesFull} from './ReportDescription'
import {ExpirationDate} from './ReportHeader'
import {ReportInfluencer} from './ReportInfluencer'
import {ReportResponseComponent} from './ReportResponse'
import {ReportResponseForm} from './ReportResponseForm/ReportResponseForm'

export const ReportPro = () => {
  const {id} = useParams<{id: Id}>()
  const _getReport = useGetReportQuery(id!)
  return (
    <Page maxWidth="l" loading={_getReport.isLoading}>
      {_getReport.data && <ReportProLoaded reportSearchResult={_getReport.data} />}
    </Page>
  )
}

function ReportProLoaded({reportSearchResult}: {reportSearchResult: ReportSearchResult}) {
  const {m} = useI18n()
  const queryClient = useQueryClient()
  const {report, files} = reportSearchResult
  const {reportEvents, responseEvent} = useGetReportEventsQuery(report.id)
  const _getReviewOnReportResponse = useGetReviewOnReportResponseQuery(report.id)
  const responseFormRef = useRef<HTMLElement>(null)

  function scrollToResponse() {
    if (responseFormRef.current) {
      responseFormRef.current.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'})
    }
  }

  const hasResponse = !!responseEvent
  const isClosed = Report.isClosed(report.status)
  const hasToRespond = !hasResponse && !isClosed

  return (
    <div className="mt-8">
      <LinkBackToList {...{report}} />
      <ReportBlock {...{scrollToResponse, reportSearchResult, isClosed, hasToRespond}} />
      {hasResponse && (
        <ResponseBlock {...{report, responseEvent, files}} responseConsumerReview={_getReviewOnReportResponse.data} />
      )}
      {hasToRespond && (
        <ReportResponseForm
          ref={responseFormRef}
          report={report}
          onConfirm={() => {
            queryClient
              .invalidateQueries({queryKey: GetReportEventsQueryKeys(report.id)})
              .then(() => queryClient.invalidateQueries({queryKey: GetReportQueryKeys(report.id)}))
          }}
        />
      )}
      {reportEvents && (
        <CleanWidePanel>
          <h1 className="font-bold text-3xl mb-8">{m.reportHistory}</h1>
          <ReportEvents events={[creationReportEvent(report), ...reportEvents]} />
        </CleanWidePanel>
      )}
    </div>
  )
}

function LinkBackToList({report}: {report: Report}) {
  const closed = Report.getStatusProByStatus(report.status) === ReportStatusPro.Cloture
  const url = closed ? siteMap.logged.reportsfiltred.closed : siteMap.logged.reports()
  return (
    <Link to={url} className="flex items-center text-scbluefrance mb-2 no-underline hover:underline gap-2">
      <Icon>arrow_back</Icon> Retour à la liste des signalements{closed ? ' clotûrés' : ''}
    </Link>
  )
}

function ReportBlock({
  reportSearchResult,
  isClosed,
  hasToRespond,
  scrollToResponse,
}: {
  reportSearchResult: ReportSearchResult
  isClosed: boolean
  hasToRespond: boolean
  scrollToResponse: () => void
}) {
  const {m} = useI18n()
  const {report, files} = reportSearchResult
  return (
    <CleanWidePanel>
      <Header {...{reportSearchResult, isClosed, scrollToResponse, hasToRespond}} />
      <div>
        {report.influencer && (
          <>
            <h2 className="text-base font-bold">{m.influencerIdentifiedTitle}</h2>
            <ReportInfluencer influencer={report.influencer} />
            <HorizontalLine />
          </>
        )}
        <ReportDetails {...{report}} />
        <HorizontalLine />
        <ReportFilesFull files={files} {...{report}} />
        <HorizontalLine />
        <Consumer {...{report}} />
      </div>
    </CleanWidePanel>
  )
}

function ResponseBlock({
  responseEvent,
  report,
  files,
  responseConsumerReview,
}: {
  responseEvent: ReportProResponseEvent
  report: Report
  files: UploadedFile[]
  responseConsumerReview: ResponseConsumerReview | undefined
}) {
  const {formatDateTime} = useI18n()

  return (
    <CleanWidePanel>
      <h1 className="font-bold text-3xl">Votre réponse</h1>
      <p className="mb-4">Le {formatDateTime(responseEvent.data.creationDate)}</p>
      <ReportResponseComponent
        canEditFile={false}
        response={responseEvent.data}
        consumerReportReview={responseConsumerReview}
        report={report}
        files={files.filter(_ => _.origin === FileOrigin.Professional)}
      />
    </CleanWidePanel>
  )
}

function Header({
  reportSearchResult,
  scrollToResponse,
  isClosed,
  hasToRespond,
}: {
  reportSearchResult: ReportSearchResult
  scrollToResponse: () => void
  isClosed: boolean
  hasToRespond: boolean
}) {
  const {m, formatDate, formatTime} = useI18n()
  const {report} = reportSearchResult
  const companySiret = report.companySiret
  return (
    <div className="text-left mb-8">
      <div className="flex justify-between flex-col gap-4 sm:gap-0 sm:flex-row ">
        <div className="pb-4">
          <h1 className="font-bold text-3xl ">
            <span>Signalement</span>
          </h1>
          <p className="flex flex-col lg:flex-row lg:items-end gap-1">
            <span>
              À propos de l'entreprise <span className="font-bold">{report.companyName}</span>
            </span>{' '}
            <span>
              (<span className="text-sm italic">{report.companySiret}</span>)
            </span>
          </p>
          <p className="font-bold text-base">
            Le {formatDate(report.creationDate)}{' '}
            <span className="text-base text-gray-500">à {formatTime(report.creationDate)}</span>
          </p>
          <p>{report.contactAgreement ? <span>Par {report.email}</span> : <span>Par un consommateur anonyme</span>}</p>
          <ExpirationDate {...{report}} isUserPro={true} />
        </div>
        {companySiret && <ReportAssignement {...{reportSearchResult, companySiret}} />}
      </div>
      {isClosed && <div className="flex items-center justify-center bg-[#e3e3fd]  p-2">Signalement cloturé.</div>}
      {hasToRespond && (
        <div className="flex items-center justify-center mt-4">
          <ScButton onClick={scrollToResponse} color="primary" variant="contained" size="large" iconAfter="question_answer">
            {m.answer}
          </ScButton>
        </div>
      )}
    </div>
  )
}

function Consumer({report}: {report: Report}) {
  const {m} = useI18n()
  return (
    <div className="mb-4">
      <h2 className="font-bold">{m.consumer}</h2>
      {report.contactAgreement ? (
        <>
          <div className="">
            {capitalize(report.firstName)}
            &nbsp;
            {capitalize(report.lastName)}
          </div>
          <span className="">{report.email}</span>
          <ReportReferenceNumber consumerReferenceNumber={report.consumerReferenceNumber} />
        </>
      ) : (
        <span className="">{m.reportConsumerWantToBeAnonymous}</span>
      )}
    </div>
  )
}

function HorizontalLine() {
  return <hr className="h-[1px] my-4 bg-gray-300 border-0 rounded" />
}
