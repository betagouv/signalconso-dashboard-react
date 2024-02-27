import {Box, Grid, Tab, Tabs, Tooltip} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import React, {useMemo, useState} from 'react'
import {useParams} from 'react-router'
import {Divider} from 'shared/Divider'
import {WithInlineIcon} from 'shared/WithInlineIcon'
import {Btn} from '../../alexlibs/mui-extension'
import {map} from '../../alexlibs/ts-utils'
import {EventActionValues, EventType, ReportEvent} from '../../core/client/event/Event'
import {FileOrigin} from '../../core/client/file/UploadedFile'
import {Report, ReportStatus} from '../../core/client/report/Report'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {Id} from '../../core/model'
import {useGetCompanyEventsQuery, useGetReportEventsQuery} from '../../core/queryhooks/eventQueryHooks'
import {useGetReportQuery, useGetReviewOnReportResponseQuery} from '../../core/queryhooks/reportQueryHooks'
import {ScButton} from '../../shared/Button'
import {Page} from '../../shared/Page'
import {Panel} from '../../shared/Panel'
import {ReportEvents} from './Event/ReportEvents'
import {ReportAdminResolution} from './ReportAdminResolution'
import {ReportBarcodeProduct} from './ReportBarcodeProduct'
import {ReportCompany} from './ReportCompany/ReportCompany'
import {ReportConsumer} from './ReportConsumer/ReportConsumer'
import {ReportDetails, ReportFilesFull} from './ReportDescription'
import {ReportDownloadAction} from './ReportDownloadAction'
import {ReportHeader} from './ReportHeader'
import {ReportPostAction} from './ReportPostAction'
import {ReportReOpening} from './ReportReOpening'
import {ReportResponseComponent} from './ReportResponse'

const CONSO: EventType = 'CONSO'

export const creationReportEvent = (report: Report): ReportEvent =>
  Object.freeze({
    data: {
      id: 'dummy',
      details: {} as any,
      reportId: report.id,
      eventType: CONSO,
      creationDate: report.creationDate,
      action: EventActionValues.Creation,
    },
  })

export const ReportComponent = () => {
  const {id} = useParams<{id: Id}>()
  const {m} = useI18n()
  const {connectedUser, apiSdk} = useLogin()
  const [activeTab, setActiveTab] = useState(0)

  const _getReport = useGetReportQuery(id)
  const _getReviewOnReportResponse = useGetReviewOnReportResponseQuery(id, {enabled: !!_getReport.data?.report.id})
  const _getCompanyEvents = useGetCompanyEventsQuery(_getReport.data?.report.companySiret!, {
    enabled: !!_getReport.data?.report.companySiret,
  })
  const {
    reportEvents,
    responseEvent,
    refetch: refetchReportEvents,
    isLoading: reportEventsIsLoading,
  } = useGetReportEventsQuery(id)

  const downloadReport = useMutation({mutationFn: (id: Id) => apiSdk.secured.reports.download([id])})
  const generateConsumerNotificationAsPDF = useMutation({mutationFn: apiSdk.secured.reports.generateConsumerNotificationAsPDF})

  return (
    <Page loading={_getReport.isLoading}>
      {map(_getReport.data?.report, report => (
        <>
          <ReportHeader elevated report={report}>
            <Box
              sx={{
                whiteSpace: 'nowrap',
                display: 'flex',
                flexDirection: 'row-reverse',
                flexWrap: 'wrap',
              }}
            >
              {connectedUser.isAdmin &&
                (report.status === ReportStatus.NonConsulte || report.status === ReportStatus.ConsulteIgnore) && (
                  <ReportReOpening report={report}>
                    <Tooltip title={m.reportReopening}>
                      <Btn color="primary" icon="replay">
                        {m.reportReopening}
                      </Btn>
                    </Tooltip>
                  </ReportReOpening>
                )}

              {connectedUser.isAdmin && report.status !== ReportStatus.PromesseAction && (
                <ReportAdminResolution label={m.administratorAction} report={report} onAdd={() => refetchReportEvents()}>
                  <Tooltip title={m.administratorAction}>
                    <Btn color="primary" icon="add_comment">
                      {m.administratorAction}
                    </Btn>
                  </Tooltip>
                </ReportAdminResolution>
              )}

              {_getReport.data?.files && _getReport.data?.files.length > 0 ? (
                <ReportDownloadAction report={report} files={_getReport.data?.files}>
                  <Btn color="primary" icon="download">
                    {m.download}
                  </Btn>
                </ReportDownloadAction>
              ) : (
                <Btn
                  color="primary"
                  icon="download"
                  loading={downloadReport.isPending}
                  onClick={() => downloadReport.mutate(report.id)}
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
                  onClick={() => generateConsumerNotificationAsPDF.mutate(report.id)}
                >
                  Accusé reception
                </ScButton>
              )}
            </Box>
          </ReportHeader>
          {!report.visibleToPro && (
            <div className="bg-yellow-100  border border-gray-700 mx-2 p-4 mb-4">
              <h3 className="font-bold">
                <WithInlineIcon icon="visibility_off">Signalement confidentiel</WithInlineIcon>
              </h3>
              Ce signalement n'a pas été transmis à l'entreprise.
              <br />
              L'entreprise <span className="font-bold">ne sait même pas que ce signalement existe</span>. Ne pas lui divulguer.
            </div>
          )}
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} sm={6}>
              <ReportConsumer report={report} canEdit={connectedUser.isAdmin} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ReportCompany report={report} canEdit={connectedUser.isAdmin} />
            </Grid>
          </Grid>

          {_getReport.data?.report.barcodeProductId && (
            <ReportBarcodeProduct barcodeProductId={_getReport.data.report.barcodeProductId} />
          )}

          <div className="border border-solid border-gray-300 rounded p-4 mb-4">
            <ReportDetails {...{report}} />
            <Divider margin />
            <ReportFilesFull files={_getReport.data?.files} {...{report}} />
          </div>
          <Panel loading={reportEventsIsLoading}>
            <>
              <Tabs
                sx={{
                  borderBottom: t => '1px solid ' + t.palette.divider,
                }}
                value={activeTab}
                onChange={(event: React.ChangeEvent<{}>, newValue: number) => setActiveTab(newValue)}
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
                      response={responseEvent?.data}
                      consumerReportReview={_getReviewOnReportResponse.data}
                      files={_getReport.data?.files.filter(_ => _.origin === FileOrigin.Professional)}
                    />
                  )}
                </div>
              </ReportTabPanel>
              <ReportTabPanel value={activeTab} index={1}>
                <ReportEvents
                  events={reportEventsIsLoading ? undefined : [creationReportEvent(report), ...(reportEvents ?? [])]}
                />
              </ReportTabPanel>
              <ReportTabPanel value={activeTab} index={2}>
                <ReportEvents events={_getCompanyEvents.isLoading ? undefined : _getCompanyEvents.data ?? []} />
              </ReportTabPanel>
            </>
          </Panel>
        </>
      ))}
    </Page>
  )
}

interface ReportTabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

const ReportTabPanel = (props: ReportTabPanelProps) => {
  const {children, value, index, ...other} = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  )
}
