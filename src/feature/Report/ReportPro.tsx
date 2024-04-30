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
import {UserNameLabel} from '../../shared/UserNameLabel'
import {ReportEvents} from './Event/ReportEvents'
import {creationReportEvent} from './Report'
import {ReportAssignement} from './ReportAssignement'
import {ReportDetails, ReportFilesFull} from './ReportDescription'
import {ExpirationDate} from './ReportHeader'
import {ReportInfluencer} from './ReportInfluencer'
import {ReportResponseComponent} from './ReportResponse'
import {ReportResponseForm} from './ReportResponseForm/ReportResponseForm'
import {ReportStation} from './ReportStation'
import {ReportTrain} from './ReportTrain'
import {ReportCategories} from './ReportCategories'
import { Alert } from 'alexlibs/mui-extension'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';


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
      <ReportBlock {...{scrollToResponse, reportSearchResult, responseEvent, isClosed, hasToRespond}} />
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
  const categories = [m.ReportCategoryDesc[report.category], ...report.subcategories];
  return (
    <CleanWidePanel>
      <Header {...{reportSearchResult, isClosed, scrollToResponse, hasToRespond, responseEvent}} />
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
        {/* <ReportCategories categories={categories} /> */}
        {renderCategoryMessage(categories)}
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
        response={responseEvent}
        consumerReportReview={responseConsumerReview}
        report={report}
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


interface CategoryDetail {
  tag: string[];
  message: string;
  baseLinkText: string;
  link: string;
}

const categoryMessages: CategoryDetail[] = [
  {
    tag: ["produit périmé"],
    message: "Ce signalement concerne un produit périmé. Pour connaître la réglementation applicable aux DLC et DDM, rendez-vous sur la ",
    baseLinkText: 'fiche pratique de la DGCCRF "Date limite de consommation DLC et DDM" ',
    link: "https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/Date-limite-de-consommation-DLC-et-DDM"
  },
  {
    tag: ["commande internet"],
    message: "Ce signalement concerne une commande réalisée sur internet. Pour connaître la réglementation applicable au e-commerce, rendez-vous sur la ",
    baseLinkText: 'fiche pratique de la DGCCRF "E commerce règles applicables au commerce électronique" ',
    link: "https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/E-commerce-regles-applicables-au-commerce-electronique"
  },
  {
    tag: ["problème de prix ou paiement"],
    message: "Ce signalement concerne l’impression des tickets de caisse. Pour connaître la réglementation applicable à ce sujet, rendez-vous sur la ",
    baseLinkText: 'fiche pratique de la DGCCRF "Impression des tickets de caisse et autres à la demande des clients" ',
    link: "https://www.economie.gouv.fr/dgccrf/impression-des-tickets-de-caisse-et-autres-la-demande-des-clients"
  },
  {
    tag: ["quantité non conforme"],
    message: "Ce signalement concerne un problème avec une quantité de produits achetée. Pour connaître la réglementation applicable à ce sujet, rendez-vous sur la ",
    baseLinkText: 'fiche pratique de la DGCCRF "Contrôle des quantités vendues à destination des professionnels" ',
    link: "https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/quantite-produits"
  },
  {
    tag: ["démarchage téléphonique"],
    message: "Ce signalement concerne un démarchage à domicile. Pour connaître la réglementation applicable au démarchage abusif, rendez-vous sur la ",
    baseLinkText: 'fiche pratique de la DGCCRF "Renforcement des mesures pour lutter contre le démarchage abusif" ',
    link: "https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/renforcement-des-mesures-pour-lutter-contre-le-demarchage-abusif"
  },
  {
    tag: ["Un problème qui concerne le magasin de façon générale", "Prix", "Prix des prestations"],
    message: "Ce signalement concerne l’affichage des prix. Pour connaître la réglementation applicable à ce sujet, rendez-vous sur la ",
    baseLinkText: 'fiche pratique de la DGCCRF "Information sur les prix" ',
    link: "https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/L-information-sur-les-prix"
  },
  {
    tag: ["alimentation animale"],
    message: "Ce signalement concerne l’alimentation animale. Pour connaître la réglementation applicable à ce sujet, rendez-vous sur la ",
    baseLinkText: 'fiche pratique de la DGCCRF "alimentation animale professionnels" ',
    link: "https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/alimentation-animale-professionnels"
  }
];


function renderCategoryMessage(categories: string[]): JSX.Element | null {
  console.log("Received categories for messages:", categories);
  for (const category of categories) {
    const detail = categoryMessages.find(detail => detail.tag.includes(category));
    if (detail) {
      return (
        <Alert type="info">
          <p>{detail.message}<a href={detail.link} target="_blank" rel="noopener noreferrer">{detail.baseLinkText}<OpenInNewIcon style={{ fontSize: '1rem' }} /></a>.</p>
        </Alert>
      );
    }
  }

  return null; 
}

