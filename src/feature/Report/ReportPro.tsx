import { Icon, Tooltip, useMediaQuery } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { formatDate } from 'core/i18n/format'
import { useEffect, useRef } from 'react'

import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { Alert, Btn } from '../../alexlibs/mui-extension'
import {
  ConsumerReview,
  ReportProResponseEvent,
} from '../../core/client/event/Event'
import { FileOrigin, UploadedFile } from '../../core/client/file/UploadedFile'
import {
  Report,
  ReportClosedReason,
  ReportExtra,
  ReportSearchResult,
  ReportStatusPro,
  ReportUtils,
} from '../../core/client/report/Report'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { capitalize } from '../../core/helper'
import { useI18n } from '../../core/i18n'
import { Id, MinimalUser } from '../../core/model'
import { initTally } from '../../core/plugins/Tally'
import {
  GetReportEventsQueryKeys,
  useGetReportEventsQuery,
} from '../../core/queryhooks/eventQueryHooks'
import {
  GetReportQueryKeys,
  useGetEngagementReviewQuery,
  useGetReportQuery,
  useGetReviewOnReportResponseQuery,
} from '../../core/queryhooks/reportQueryHooks'
import { ScButton } from '../../shared/Button'
import { Page } from '../../shared/Page'
import { UserNameLabel } from '../../shared/UserNameLabel'
import { ReportAffectation } from './affectation/ReportAffectation'
import { buildAffectationOptionFromUser } from './affectation/reportAffectationUtils'
import { CategoryMessage } from './CategoryMessage'
import { ReportEvents } from './Event/ReportEvents'
import { creationReportEvent } from './Event/reportEventsUtils'
import { ReportDetails, ReportFilesFull } from './ReportDescription'
import { ExpirationDate } from './ReportHeader'
import { ReportInfluencer } from './ReportInfluencer'
import { ReportProduct } from './ReportProduct'
import { ReportResponseComponent } from './ReportResponse'
import { ReportResponseForm } from './ReportResponseForm/ReportResponseForm'
import { ReportStationPro } from './ReportStation'
import { ReportTrainPro } from './ReportTrain'
import { WithReferenceNumberTooltip } from './WithReferenceNumberTooltip'

export const ReportPro = ({ reportId }: { reportId: Id }) => {
  useEffect(() => {
    initTally()
  }, [])

  const _getReport = useGetReportQuery(reportId)
  return (
    <Page loading={_getReport.isLoading}>
      {_getReport.data && <ReportProLoaded reportExtra={_getReport.data} />}
    </Page>
  )
}

export function ReportProLoaded({ reportExtra }: { reportExtra: ReportExtra }) {
  const { m } = useI18n()
  const queryClient = useQueryClient()
  const { api: apiSdk } = useConnectedContext()
  const { report, files } = reportExtra
  const { reportEvents, responseEvent } = useGetReportEventsQuery(report.id)
  const _getReviewOnReportResponse = useGetReviewOnReportResponseQuery(
    report.id,
  )
  const _getEngagementReview = useGetEngagementReviewQuery(report.id)
  const responseFormRef = useRef<HTMLDivElement>(null)

  function scrollToResponse() {
    if (responseFormRef.current) {
      responseFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    }
  }

  const downloadReport = useMutation({
    mutationFn: (id: Id) => apiSdk.secured.reports.download(id),
  })

  const download = (event: any) => {
    event.preventDefault() // Prevent default link behavior
    downloadReport.mutate(report.id)
  }

  const hasResponse = !!responseEvent
  const closedReason = ReportUtils.getClosedReason(report, responseEvent)
  const isClosed = !!closedReason
  const hasToRespond = !hasResponse && !isClosed

  return (
    <div className="mt-8">
      <div className={'flex justify-between items-center'}>
        <LinkBackToList {...{ report }} />
        <a
          target="_blank"
          onClick={download}
          className="flex items-center text-scbluefrance mb-2 no-underline hover:underline gap-2"
        >
          <Icon>download</Icon>Télécharger au format PDF
        </a>
      </div>

      <ReportBlock
        {...{
          scrollToResponse,
          reportSearchResult: reportExtra,
          responseEvent,
          closedReason,
          hasToRespond,
        }}
      />
      {hasResponse && (
        <ResponseBlock
          {...{ report, responseEvent, files }}
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
              .invalidateQueries({
                queryKey: GetReportEventsQueryKeys(report.id),
              })
              .then(() =>
                queryClient.invalidateQueries({
                  queryKey: GetReportQueryKeys(report.id),
                }),
              )
          }}
        />
      )}
      {reportEvents && (
        <CleanWidePanel>
          <h1 className="font-bold text-3xl mb-8">{m.reportHistory}</h1>
          <ReportEvents
            events={[creationReportEvent(report), ...reportEvents]}
          />
        </CleanWidePanel>
      )}
    </div>
  )
}

function LinkBackToList({ report }: { report: Report }) {
  const closed =
    ReportUtils.getStatusProByStatus(report.status) === ReportStatusPro.Cloture
  const url = closed
    ? '/suivi-des-signalements-clotures'
    : '/suivi-des-signalements'
  return (
    <Link
      to={url}
      className="flex items-center text-scbluefrance mb-2 no-underline hover:underline gap-2"
    >
      <Icon>arrow_back</Icon> Retour à la liste des signalements
      {closed ? ' clotûrés' : ''}
    </Link>
  )
}

function ReportBlock({
  reportSearchResult,
  closedReason,
  hasToRespond,
  scrollToResponse,
}: {
  reportSearchResult: ReportSearchResult
  closedReason: ReportClosedReason | undefined
  hasToRespond: boolean
  scrollToResponse: () => void
}) {
  const { m } = useI18n()
  const { report, files } = reportSearchResult
  const specialLegislation = ReportUtils.appliedSpecialLegislation(report)
  return (
    <CleanWidePanel>
      <Header
        {...{
          reportSearchResult,
          closedReason,
          scrollToResponse,
          hasToRespond,
        }}
      />
      {specialLegislation && (
        <Alert
          type="warning"
          dangerouslySetInnerHTML={{
            __html: m.specialLegislation[specialLegislation],
          }}
        />
      )}

      <div>
        {report.barcodeProductId || report.rappelConsoId ? (
          <>
            <ReportProduct
              barcodeProductId={report.barcodeProductId}
              rappelConsoId={report.rappelConsoId}
              variant="pro"
            />
            <HorizontalLine />
          </>
        ) : null}
        {report.influencer && (
          <>
            <h2 className="text-base font-bold">
              {m.influencerIdentifiedTitle}
            </h2>
            <ReportInfluencer influencer={report.influencer} />
            <HorizontalLine />
          </>
        )}
        <div className="mb-4">
          {report.train && <ReportTrainPro train={report.train} />}
          {report.station && <ReportStationPro station={report.station} />}
        </div>
        <ReportDetails {...{ report }} />
        <HorizontalLine />
        <ReportFilesFull files={files} {...{ report }} />
        <HorizontalLine />
        <Consumer {...{ report }} />
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
  const { formatDateTime } = useI18n()

  return (
    <CleanWidePanel>
      <h1 className="font-bold text-3xl">Votre réponse</h1>
      <p className="mb-4">
        Le {formatDateTime(responseEvent.event.creationDate)}
      </p>
      <ReportResponseComponent
        canEditFile={false}
        response={responseEvent}
        consumerReportReview={responseConsumerReview}
        {...{ engagementReview, report }}
        files={files.filter((_) => _.origin === FileOrigin.Professional)}
      />
    </CleanWidePanel>
  )
}

function ReportClosedLabel({
  closedReason,
}: {
  closedReason: ReportClosedReason
}) {
  return (
    <div className="flex items-center justify-center bg-sclightpurple  p-2">
      {(() => {
        switch (closedReason.kind) {
          case 'suppression_rgpd':
            return (
              <div className="flex flex-col gap-2">
                <p className="text-center font-bold">Signalement cloturé. </p>
                <p className=" text-sm">
                  Les données personnelles du consommateur à l'origine de ce
                  signalement ont été supprimées conformément aux exigences du
                  RGPD. Ce signalement est donc{' '}
                  <b>
                    vidé, clôturé, et aucune action n'est attendue de votre part
                  </b>
                  .
                </p>
              </div>
            )
          case 'no_response':
            return `Signalement cloturé : vous deviez répondre avant le ${formatDate(closedReason.expirationDate)}.`
          case 'response': {
            const user = closedReason.responseEvent?.user
            if (user) {
              return (
                <span>
                  Signalement cloturé par{' '}
                  <span className="font-bold">
                    <UserNameLabel
                      firstName={user.firstName}
                      lastName={user.lastName}
                    />
                  </span>
                  .
                </span>
              )
            }
            return 'Signalement cloturé.'
          }
        }
      })()}
    </div>
  )
}

const AssignedUserLabel = ({
  user,
  hasToRespond,
}: {
  user?: MinimalUser
  hasToRespond: boolean
}) => {
  return user ? (
    <span>{buildAffectationOptionFromUser(user).fullName} </span>
  ) : (
    <span>{hasToRespond ? 'Affecter' : 'Non affecté'}</span>
  )
}

function Header({
  reportSearchResult,
  scrollToResponse,
  closedReason,
  hasToRespond,
}: {
  reportSearchResult: ReportSearchResult
  scrollToResponse: () => void
  closedReason: ReportClosedReason | undefined
  hasToRespond: boolean
}) {
  const { m, formatDate, formatTime } = useI18n()
  const isXs = !useMediaQuery('(min-width:640px)')

  const { report } = reportSearchResult
  const assignedUser = reportSearchResult.assignedUser
  const companySiret = report.companySiret
  return (
    <div className="text-left mb-8">
      <div className="flex justify-between flex-col gap-4 sm:gap-0 sm:flex-row ">
        <div className="pb-4">
          <h1 className="font-bold text-3xl ">
            <span>Signalement</span>
          </h1>
          <p className="flex flex-col lg:flex-row lg:items-end gap-1 ">
            <span>
              À propos de l'entreprise{' '}
              <span className="font-bold">{report.companyName}</span>
            </span>{' '}
            <span>
              (<span className="text-sm italic">{report.companySiret}</span>)
            </span>
          </p>
          <div className="ml-4">
            {report.websiteURL && <p>Concernant le site {report.websiteURL}</p>}
            {report.vendor && (
              <p>
                Concernant le vendeur <b>{report.vendor}</b>
              </p>
            )}
            {report.phone && (
              <p>
                Concernant le numéro de téléphone <b>{report.phone}</b>
              </p>
            )}
          </div>
          <p className="font-bold text-base">
            Le {formatDate(report.creationDate)}{' '}
            <span className="text-base text-gray-500">
              à {formatTime(report.creationDate)}
            </span>
          </p>
          <p>
            {report.contactAgreement ? (
              <span className="break-words">Par {report.email}</span>
            ) : (
              <span>Par un consommateur anonyme</span>
            )}
          </p>
          <ExpirationDate {...{ report }} isUserPro={true} />
        </div>
        {companySiret && (
          <div>
            {hasToRespond ? (
              <ReportAffectation
                {...{ reportSearchResult, companySiret }}
                children={
                  <div className=" flex flex-col ">
                    {assignedUser && (
                      <span className={'font-bold ml-1 mb-2'}>Affecté à :</span>
                    )}
                    <Tooltip
                      title={
                        "Modifier l'affectation de l'utilisateur au signalement"
                      }
                    >
                      <div className="flex">
                        <Btn
                          variant={'outlined'}
                          className=" flex flex-row border p-2 items-center"
                          {...(isXs ? { fullWidth: true } : undefined)}
                        >
                          <AssignedUserLabel
                            user={assignedUser}
                            hasToRespond={hasToRespond}
                          />
                          <Icon
                            fontSize={'small'}
                            sx={{ fontPalette: 'primary', ml: 1 }}
                          >
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
                <Icon className="">account_circle</Icon>{' '}
                <AssignedUserLabel
                  user={assignedUser}
                  hasToRespond={hasToRespond}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {closedReason && (
        <div className="flex items-center justify-center bg-sclightpurple  p-2">
          <ReportClosedLabel closedReason={closedReason} />
        </div>
      )}
      {hasToRespond && (
        <div className="flex items-center justify-center mt-4">
          <ScButton
            onClick={scrollToResponse}
            color="primary"
            variant="contained"
            iconAfter="question_answer"
            size="large"
            {...(isXs ? { fullWidth: true } : undefined)}
          >
            {m.answer}
          </ScButton>
        </div>
      )}
    </div>
  )
}

function Consumer({ report }: { report: Report }) {
  const { m } = useI18n()
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
          {report.consumerReferenceNumber ? (
            <div>
              <WithReferenceNumberTooltip>
                {m.reportConsumerReferenceNumber}
              </WithReferenceNumberTooltip>{' '}
              : <span>{report.consumerReferenceNumber}</span>
            </div>
          ) : null}
        </>
      ) : (
        <span className="">{m.reportConsumerWantToBeAnonymous}</span>
      )}
    </div>
  )
}

function HorizontalLine() {
  return <hr className="h-px my-4 bg-gray-300 border-0 rounded" />
}
