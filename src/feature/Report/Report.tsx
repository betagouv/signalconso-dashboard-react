import { Box, Tab, Tabs, Tooltip } from '@mui/material'
import { UseQueryResult, useMutation } from '@tanstack/react-query'
import { map } from 'core/helper'
import React, { useState } from 'react'
import { Divider } from 'shared/Divider'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'
import { ReportBlockTitle } from 'shared/ReportBlockTitle'
import { Btn } from '../../alexlibs/mui-extension'
import { EventActionValues } from '../../core/client/event/Event'
import { FileOrigin } from '../../core/client/file/UploadedFile'
import {
  ReportExtra,
  ReportStatus,
  ReportUtils,
} from '../../core/client/report/Report'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useI18n } from '../../core/i18n'
import { Id } from '../../core/model'
import {
  useGetCompanyEventsQuery,
  useGetReportEventsQuery,
} from '../../core/queryhooks/eventQueryHooks'
import {
  useGetEngagementReviewQuery,
  useGetReportQuery,
  useGetReviewOnReportResponseQuery,
} from '../../core/queryhooks/reportQueryHooks'
import { ScButton } from '../../shared/Button'
import { Page } from '../../shared/Page'
import { isStatusFinal } from '../../shared/reportStatusUtils'
import { ReportEvents } from './Event/ReportEvents'
import { creationReportEvent } from './Event/reportEventsUtils'
import { ReportAdminResolution } from './ReportAdminResolution'
import { ReportAlbert } from './ReportAlbert'
import { ReportCompany } from './ReportCompany/ReportCompany'
import { ReportConsumer } from './ReportConsumer/ReportConsumer'
import { ReportDetails, ReportFilesFull } from './ReportDescription'
import { ReportDownloadAction } from './reportDownload/ReportDownloadAction'
import { trackReportDownload } from './reportDownload/reportDownloadUtils'
import { ReportHeader } from './ReportHeader'
import { ReportPostAction } from './ReportPostAction'
import { ReportProduct } from './ReportProduct'
import { ReportReOpening } from './ReportReOpening'
import { ReportResponseComponent } from './ReportResponse'
import { ReportViewAsPro } from './ReportViewAsPro'

export const ReportComponent = ({ reportId }: { reportId: Id }) => {
  const [viewAsPro, setViewAsPro] = useState(false)
  const _getReport = useGetReportQuery(reportId)

  if (viewAsPro) {
    return _getReport.data ? (
      <ReportViewAsPro
        reportSearchResult={_getReport.data}
        onBackToStandardView={() => setViewAsPro(false)}
      />
    ) : null
  }
  return (
    <ReportViewStandard
      {...{ _getReport }}
      id={reportId}
      onViewAsPro={() => setViewAsPro(true)}
    />
  )
}

const ReportViewStandard = ({
  id,
  _getReport,
  onViewAsPro,
}: {
  id: string
  _getReport: UseQueryResult<ReportExtra>
  onViewAsPro: () => void
}) => {
  const { m } = useI18n()
  const { connectedUser, api: apiSdk } = useConnectedContext()
  const [activeTab, setActiveTab] = useState(0)

  const enableReviewQueries = !!_getReport.data?.report.id && !!id
  const _getReviewOnReportResponse = useGetReviewOnReportResponseQuery(id!, {
    enabled: enableReviewQueries,
  })
  const _getEngagementReview = useGetEngagementReviewQuery(id!, {
    enabled: enableReviewQueries,
  })
  const _getCompanyEvents = useGetCompanyEventsQuery(
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    _getReport.data?.report.companySiret!,
    {
      enabled: !!_getReport.data?.report.companySiret,
    },
  )
  const {
    reportEvents,
    responseEvent,
    refetch: refetchReportEvents,
    isLoading: reportEventsIsLoading,
  } = useGetReportEventsQuery(id!)

  const isAdminClosure = !!reportEvents?.find(
    (e) => e.event.action === 'SolvedContractualDisputeReportDeletion',
  )

  const downloadReport = useMutation({
    mutationFn: (id: Id) => apiSdk.secured.reports.download([id]),
  })
  const generateConsumerNotificationAsPDF = useMutation({
    mutationFn: apiSdk.secured.reports.generateConsumerNotificationAsPDF,
  })

  return (
    <Page loading={_getReport.isLoading}>
      {map(_getReport.data, (reportExtra) => {
        const report = reportExtra.report
        return (
          <>
            {connectedUser.isAdmin ? (
              <div className="flex justify-end mb-1">
                <button
                  onClick={onViewAsPro}
                  className="underline text-sm text-scbluefrance"
                >
                  Voir ce que voit le pro
                </button>
              </div>
            ) : null}
            <ReportHeader
              elevated
              report={reportExtra}
              isAdminClosure={isAdminClosure}
            >
              <Box
                sx={{
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  flexWrap: 'wrap',
                }}
              >
                {connectedUser.isAdmin &&
                  ReportUtils.canReopenReport(report.status) && (
                    <ReportReOpening reportIds={[report.id]} />
                  )}

                {connectedUser.isAdmin &&
                  report.status !== ReportStatus.SuppressionRGPD && (
                    <ReportAdminResolution
                      label={m.administratorAction}
                      report={report}
                      onAdd={() => refetchReportEvents()}
                    >
                      <Tooltip title={m.administratorAction}>
                        <Btn color="primary" icon="add_comment">
                          {m.administratorAction}
                        </Btn>
                      </Tooltip>
                    </ReportAdminResolution>
                  )}

                {_getReport.data?.files && _getReport.data?.files.length > 0 ? (
                  <ReportDownloadAction
                    report={report}
                    files={_getReport.data?.files}
                  >
                    <Btn color="primary" icon="download">
                      {m.download}
                    </Btn>
                  </ReportDownloadAction>
                ) : (
                  <Btn
                    color="primary"
                    icon="download"
                    loading={downloadReport.isPending}
                    onClick={() => {
                      trackReportDownload(connectedUser, 'reportOnly')
                      downloadReport.mutate(report.id)
                    }}
                  >
                    {m.download}
                  </Btn>
                )}

                <ReportPostAction
                  actionType={EventActionValues.Comment}
                  label={m.addDgccrfComment}
                  report={report}
                  onAdd={refetchReportEvents}
                >
                  <Tooltip title={m.addDgccrfComment}>
                    <Btn color="primary" icon="add_comment">
                      {m.comment}
                    </Btn>
                  </Tooltip>
                </ReportPostAction>

                {(connectedUser.isDGCCRF || connectedUser.isDGAL) && (
                  <ReportPostAction
                    actionType={EventActionValues.Control}
                    label={m.markDgccrfControlDone}
                    report={report}
                    onAdd={refetchReportEvents}
                  >
                    <Tooltip title={m.markDgccrfControlDone}>
                      <Btn color="primary" icon="add_comment">
                        {m.dgccrfControlDone}
                      </Btn>
                    </Tooltip>
                  </ReportPostAction>
                )}

                {connectedUser.isAdmin && (
                  <ScButton
                    loading={generateConsumerNotificationAsPDF.isPending}
                    icon="download"
                    onClick={() =>
                      generateConsumerNotificationAsPDF.mutate(report.id)
                    }
                  >
                    Accusé reception
                  </ScButton>
                )}
              </Box>
            </ReportHeader>
            {!report.visibleToPro && (
              <div className="bg-yellow-100  border border-gray-700 mx-4 p-4 mb-4">
                <h3 className="font-bold">
                  <ReportBlockTitle icon="visibility_off">
                    Signalement confidentiel
                  </ReportBlockTitle>
                </h3>
                Ce signalement n'a pas été transmis à l'entreprise.
                <br />
                L'entreprise{' '}
                <span className="font-bold">
                  ne sait même pas que ce signalement existe
                </span>
                . Ne pas lui divulguer.
              </div>
            )}
            <div className="grid xl:grid-cols-2 xl:gap-4 ">
              <ReportConsumer report={report} canEdit={connectedUser.isAdmin} />
              <ReportCompany
                reportExtra={reportExtra}
                canEdit={connectedUser.isAdmin && !isStatusFinal(report.status)}
              />
            </div>

            <ReportProduct
              barcodeProductId={_getReport.data?.report.barcodeProductId}
              rappelConsoId={_getReport.data?.report.rappelConsoId}
              variant="agent_or_admin"
            />

            {connectedUser.isNotPro && <ReportAlbert id={id} />}

            <CleanDiscreetPanel>
              <ReportDetails {...{ report }} />
              <Divider margin />
              <ReportFilesFull files={_getReport.data?.files} {...{ report }} />
            </CleanDiscreetPanel>
            <CleanDiscreetPanel loading={reportEventsIsLoading} noPaddingTop>
              <>
                <Tabs
                  sx={{
                    paddingTop: 0,
                    borderBottom: (t) => '1px solid ' + t.palette.divider,
                  }}
                  value={activeTab}
                  onChange={(
                    event: React.ChangeEvent<object>,
                    newValue: number,
                  ) => setActiveTab(newValue)}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab label={m.proResponse} />
                  <Tab label={m.reportHistory} />
                  <Tab label={m.companyHistory} />
                </Tabs>
                <ReportTabPanel value={activeTab} index={0}>
                  <div className="p-4">
                    {responseEvent && (
                      <ReportResponseComponent
                        canEditFile
                        report={report}
                        response={responseEvent}
                        consumerReportReview={_getReviewOnReportResponse.data}
                        engagementReview={_getEngagementReview.data}
                        files={_getReport.data?.files.filter(
                          (_) => _.origin === FileOrigin.Professional,
                        )}
                      />
                    )}
                  </div>
                </ReportTabPanel>
                <ReportTabPanel value={activeTab} index={1}>
                  <ReportEvents
                    events={
                      reportEventsIsLoading
                        ? undefined
                        : [creationReportEvent(report), ...(reportEvents ?? [])]
                    }
                  />
                </ReportTabPanel>
                <ReportTabPanel value={activeTab} index={2}>
                  <ReportEvents
                    events={
                      _getCompanyEvents.isLoading
                        ? undefined
                        : (_getCompanyEvents.data ?? [])
                    }
                  />
                </ReportTabPanel>
              </>
            </CleanDiscreetPanel>
          </>
        )
      })}
    </Page>
  )
}

interface ReportTabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

const ReportTabPanel = (props: ReportTabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className={'overflow-auto'}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  )
}
