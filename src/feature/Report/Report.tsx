import React, {useMemo, useState} from 'react'
import {Page} from '../../shared/Page'
import {useParams} from 'react-router'
import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {Box, Grid, Tab, Tabs, Tooltip} from '@mui/material'
import {ReportEvents} from './Event/ReportEvents'
import {ReportResponseComponent} from './ReportResponse'
import {ReportHeader} from './ReportHeader'
import {Btn} from '../../alexlibs/mui-extension'
import {ReportPostAction} from './ReportPostAction'
import {useLogin} from '../../core/context/LoginContext'
import {ReportConsumer} from './ReportConsumer/ReportConsumer'
import {ReportCompany} from './ReportCompany/ReportCompany'
import {ReportDescription} from './ReportDescription'
import {map} from '../../alexlibs/ts-utils'
import {EventActionValues, EventType, ReportEvent} from '../../core/client/event/Event'
import {FileOrigin} from '../../core/client/file/UploadedFile'
import {Report, ReportStatus} from '../../core/client/report/Report'
import {Id} from '../../core/model'
import {ScButton} from '../../shared/Button'
import {WithInlineIcon} from 'shared/WithInlineIcon'
import {ReportAdminResolution} from './ReportAdminResolution'
import {ReportBarcodeProduct} from './ReportBarcodeProduct'
import {ReportReOpening} from './ReportReOpening'
import {useMutation} from '@tanstack/react-query'
import {useGetReportQuery, useGetReviewOnReportResponseQuery} from '../../core/hooks/reportsHooks'
import {useGetCompanyEventsQuery, useGetReportEventsQuery} from '../../core/hooks/eventsHooks'

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
  const _getCompanyEvents = useGetCompanyEventsQuery(_getReport.data?.report.companySiret, {
    enabled: !!_getReport.data?.report.companySiret,
  })
  const _getReportEvents = useGetReportEventsQuery(id)

  const response = useMemo(
    () => _getReportEvents.data?.find(_ => _.data.action === EventActionValues.ReportProResponse),
    [_getReportEvents.data],
  )

  const downloadReport = useMutation((reportId: Id) => apiSdk.secured.reports.download([reportId]))
  const generateConsumerNotificationAsPDF = useMutation((reportId: Id) =>
    apiSdk.secured.reports.generateConsumerNotificationAsPDF(reportId),
  )

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
                <ReportAdminResolution label={m.administratorAction} report={report} onAdd={() => _getReportEvents.refetch()}>
                  <Tooltip title={m.administratorAction}>
                    <Btn color="primary" icon="add_comment">
                      {m.administratorAction}
                    </Btn>
                  </Tooltip>
                </ReportAdminResolution>
              )}

              <Btn
                color="primary"
                icon="download"
                loading={downloadReport.isLoading}
                onClick={() => downloadReport.mutate(report.id)}
              >
                {m.download}
              </Btn>

              <ReportPostAction
                actionType={EventActionValues.Comment}
                label={m.addDgccrfComment}
                report={report}
                onAdd={() => _getReportEvents.refetch()}
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
                  onAdd={() => _getReportEvents.refetch()}
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
                  loading={generateConsumerNotificationAsPDF.isLoading}
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

          <ReportDescription report={report} files={_getReport.data?.files} />

          <Panel loading={_getReportEvents.isLoading}>
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
                <ReportResponseComponent
                  canEditFile
                  report={report}
                  response={response?.data}
                  consumerReportReview={_getReviewOnReportResponse.data}
                  files={_getReport.data?.files.filter(_ => _.origin === FileOrigin.Professional)}
                />
              </ReportTabPanel>
              <ReportTabPanel value={activeTab} index={1}>
                <ReportEvents
                  events={
                    _getReportEvents.isLoading ? undefined : [creationReportEvent(report), ...(_getReportEvents.data ?? [])]
                  }
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
