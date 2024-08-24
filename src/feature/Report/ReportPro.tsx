import {FormControl, Icon, InputLabel, Select, Tooltip} from '@mui/material'
import {useQueryClient} from '@tanstack/react-query'
import {siteMap} from 'core/siteMap'
import {ReportReferenceNumber} from 'feature/Report/ReportReferenceNumber'
import React, {useRef} from 'react'
import {useParams} from 'react-router'
import {Link} from 'react-router-dom'
import {CleanWidePanel} from 'shared/Panel/simplePanels'
import {ConsumerReview, EventActionValues, ReportProResponseEvent} from '../../core/client/event/Event'
import {FileOrigin, UploadedFile} from '../../core/client/file/UploadedFile'
import {Report, ReportSearchResult, ReportStatusPro} from '../../core/client/report/Report'
import {capitalize} from '../../core/helper'
import {useI18n} from '../../core/i18n'
import {Id, MinimalUser} from '../../core/model'
import {GetReportEventsQueryKeys, useGetReportEventsQuery} from '../../core/queryhooks/eventQueryHooks'
import {
  GetReportQueryKeys,
  useGetEngagementReviewQuery,
  useGetReportQuery,
  useGetReviewOnReportResponseQuery,
} from '../../core/queryhooks/reportQueryHooks'
import {ScButton} from '../../shared/Button'
import {Page} from '../../shared/Page'
import {UserNameLabel} from '../../shared/UserNameLabel'
import CategoryMessage from './CategoryMessage'
import {ReportEvents} from './Event/ReportEvents'
import {creationReportEvent} from './Report'
import {ReportDetails, ReportFilesFull} from './ReportDescription'
import {ExpirationDate} from './ReportHeader'
import {ReportInfluencer} from './ReportInfluencer'
import {ReportResponseComponent} from './ReportResponse'
import {ReportResponseForm} from './ReportResponseForm/ReportResponseForm'
import {ReportStation} from './ReportStation'
import {ReportTrain} from './ReportTrain'
import {Alert, Btn} from '../../alexlibs/mui-extension'
import {ReportPostAction} from './ReportPostAction'
import {buildOptionFromUser, ReportAffectation} from './ReportAffectation'
import {ScSelect} from '../../shared/Select/Select'
import {ScInput} from '../../shared/ScInput'

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
  const _getEngagementReview = useGetEngagementReviewQuery(report.id)
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
      <ReportBlock {...{scrollToResponse, reportSearchResult, responseEvent, isClosed, hasToRespond}} />
      {hasResponse && (
        <ResponseBlock
          {...{report, responseEvent, files}}
          responseConsumerReview={_getReviewOnReportResponse.data}
          engagementReview={_getEngagementReview.data}
        />
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
  responseEvent,
  isClosed,
  hasToRespond,
  scrollToResponse,
}: {
  reportSearchResult: ReportSearchResult
  responseEvent?: ReportProResponseEvent
  isClosed: boolean
  hasToRespond: boolean
  scrollToResponse: () => void
}) {
  const {m} = useI18n()
  const {report, files} = reportSearchResult
  const specialLegislation = Report.appliedSpecialLegislation(report)
  return (
    <CleanWidePanel>
      <Header {...{reportSearchResult, isClosed, scrollToResponse, hasToRespond, responseEvent}} />
      {specialLegislation && (
        <Alert type="warning" dangerouslySetInnerHTML={{__html: m.specialLegislation[specialLegislation]}} />
      )}
      <div>
        {report.influencer && (
          <>
            <h2 className="text-base font-bold">{m.influencerIdentifiedTitle}</h2>
            <ReportInfluencer influencer={report.influencer} />
            <HorizontalLine />
          </>
        )}
        <div className="mb-4">
          {report.train && <ReportTrain train={report.train} />}
          {report.station && <ReportStation station={report.station} />}
        </div>
        <ReportDetails {...{report}} />
        <HorizontalLine />
        <ReportFilesFull files={files} {...{report}} />
        <HorizontalLine />
        <Consumer {...{report}} />
        <CategoryMessage report={report} />
      </div>
    </CleanWidePanel>
  )
}

function ResponseBlock({
  responseEvent,
  report,
  files,
  responseConsumerReview,
  engagementReview,
}: {
  responseEvent: ReportProResponseEvent
  report: Report
  files: UploadedFile[]
  responseConsumerReview: ConsumerReview | null | undefined
  engagementReview: ConsumerReview | null | undefined
}) {
  const {formatDateTime} = useI18n()

  return (
    <CleanWidePanel>
      <h1 className="font-bold text-3xl">Votre réponse</h1>
      <p className="mb-4">Le {formatDateTime(responseEvent.data.creationDate)}</p>
      <ReportResponseComponent
        canEditFile={false}
        response={responseEvent}
        consumerReportReview={responseConsumerReview}
        {...{engagementReview, report}}
        files={files.filter(_ => _.origin === FileOrigin.Professional)}
      />
    </CleanWidePanel>
  )
}

function ReportClosedLabel({eventWithUser}: {eventWithUser?: ReportProResponseEvent}) {
  return (
    <div className="flex items-center justify-center bg-[#e3e3fd]  p-2">
      {eventWithUser && eventWithUser.user ? (
        <span>
          Signalement cloturé par{' '}
          <span className="font-bold">
            <UserNameLabel firstName={eventWithUser.user.firstName} lastName={eventWithUser.user.lastName} />
          </span>
          .
        </span>
      ) : (
        'Signalement cloturé.'
      )}
    </div>
  )
}

const AssignedUserLabel = ({user, hasToRespond}: {user?: MinimalUser; hasToRespond: Boolean}) => {
  return user ? <span>{buildOptionFromUser(user).fullName} </span> : <span>{hasToRespond ? 'Assigner' : 'Non assigné'}</span>
}

function Header({
  reportSearchResult,
  responseEvent,
  scrollToResponse,
  isClosed,
  hasToRespond,
}: {
  reportSearchResult: ReportSearchResult
  responseEvent?: ReportProResponseEvent
  scrollToResponse: () => void
  isClosed: boolean
  hasToRespond: boolean
}) {
  const {m, formatDate, formatTime} = useI18n()
  const {report} = reportSearchResult
  const assignedUser = reportSearchResult.assignedUser
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
        {companySiret && (
          <div>
            {hasToRespond ? (
              <ReportAffectation
                {...{reportSearchResult, companySiret}}
                children={
                  <div className=" flex flex-col ">
                    {assignedUser && <span className={'font-bold ml-1 mb-2'}>Assigné à :</span>}
                    <Tooltip title={"Modifier l'affectation de l'utilisateur au signalement"}>
                      <div className="flex">
                        <Btn variant={'outlined'} className=" flex flex-row border p-2 items-center">
                          <AssignedUserLabel user={assignedUser} hasToRespond={hasToRespond} />
                          <Icon fontSize={'small'} sx={{fontPalette: 'primary', ml: 1}}>
                            edit
                          </Icon>
                        </Btn>
                      </div>
                    </Tooltip>
                  </div>
                }
              />
            ) : (
              <div className="flex items-center gap-1">
                <Icon className="">account_circle</Icon> <AssignedUserLabel user={assignedUser} hasToRespond={hasToRespond} />
              </div>
            )}
          </div>
        )}
      </div>

      {isClosed && (
        <div className="flex items-center justify-center bg-[#e3e3fd]  p-2">
          <ReportClosedLabel eventWithUser={responseEvent} />
        </div>
      )}
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
