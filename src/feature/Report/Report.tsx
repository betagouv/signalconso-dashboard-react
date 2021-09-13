import React, {useEffect, useMemo, useState} from 'react'
import {Page} from '../../shared/Layout'
import {useParams} from 'react-router'
import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {useReportContext} from '../../core/context/ReportContext'
import {EventActionValues, FileOrigin, Id, Report, ReportEvent} from 'core/api'
import {Grid, makeStyles, Tab, Tabs, Theme, Tooltip, useTheme} from '@material-ui/core'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {fromNullable} from 'fp-ts/lib/Option'
import {useToast} from '../../core/toast'
import {ReportEvents} from './Event/ReportEvents'
import {ReportResponseComponent} from './ReportResponse'
import {ReportHeader} from './ReportHeader'
import {Btn, Confirm} from 'mui-extension/lib'
import {ReportPostAction} from './ReportPostAction'
import {useLogin} from '../../core/context/LoginContext'
import {ReportConsumer} from './ReportConsumer/ReportConsumer'
import {ReportCompany} from './ReportCompany/ReportCompany'
import {ReportDescription} from './ReportDescription'

const useStyles = makeStyles((t: Theme) => ({
  tabs: {
    borderBottom: '1px solid ' + t.palette.divider,
  },
}))

export const creationReportEvent = (report: Report): ReportEvent =>
  Object.freeze({
    data: {
      id: 'dummy',
      details: {} as any,
      reportId: report.id,
      eventType: 'CONSO',
      creationDate: report.creationDate,
      action: EventActionValues.Creation,
    },
  })

export const ReportComponent = () => {
  const {id} = useParams<{id: Id}>()
  const {m} = useI18n()
  const _report = useReportContext()
  const theme = useTheme()
  const {connectedUser} = useLogin()
  const cssUtils = useCssUtils()
  const css = useStyles()
  const {toastError} = useToast()
  const [activeTab, setActiveTab] = useState(0)
  const response = useMemo(
    () => _report.events.entity?.find(_ => _.data.action === EventActionValues.ReportProResponse),
    [_report.events],
  )

  useEffect(() => {
    _report.get.clearCache()
    _report.get.fetch({}, id).then(({report}) => {
      if (report.companySiret) _report.companyEvents.fetch({}, report.companySiret)
    })
    _report.events.fetch({}, id)
  }, [])

  useEffect(() => {
    fromNullable(_report.get.error).map(toastError)
    fromNullable(_report.remove.error).map(toastError)
    fromNullable(_report.updateCompany.error).map(toastError)
    fromNullable(_report.companyEvents.error).map(toastError)
    fromNullable(_report.events.error).map(toastError)
  }, [_report.remove.error, _report.get.error, _report.updateCompany.error, _report.companyEvents.error, _report.events.error])

  const downloadReport = (reportId: Id) => _report.download.fetch({}, reportId)

  return (
    <Page loading={_report.get.loading}>
      {fromNullable(_report.get.entity?.report)
        .map(report => (
          <>
            <ReportHeader elevated report={report} hideSiret>
              <div className={cssUtils.nowrap}>
                {connectedUser.isDGCCRF && (
                  <ReportPostAction
                    actionType={EventActionValues.Control}
                    label={m.markDgccrfControlDone}
                    report={report}
                    onAdd={() => _report.events.fetch({force: true, clean: false}, id)}
                  >
                    <Tooltip title={m.addDgccrfComment}>
                      <Btn color="primary" icon="check_circle">
                        {m.dgccrfControlDone}
                      </Btn>
                    </Tooltip>
                  </ReportPostAction>
                )}

                <ReportPostAction
                  actionType={EventActionValues.Comment}
                  label={m.addDgccrfComment}
                  report={report}
                  onAdd={() => _report.events.fetch({force: true, clean: false}, id)}
                >
                  <Tooltip title={m.addDgccrfComment}>
                    <Btn color="primary" icon="add_comment">
                      {m.comment}
                    </Btn>
                  </Tooltip>
                </ReportPostAction>

                <Btn color="primary" icon="download" loading={_report.download.loading} onClick={() => downloadReport(report.id)}>
                  {m.download}
                </Btn>

                {connectedUser.isAdmin && (
                  <Confirm
                    title={m.removeAsk}
                    content={m.removeReportDesc(report.companySiret)}
                    onConfirm={(event, close) =>
                      _report.remove
                        .fetch({}, report.id)
                        .then(() => window.history.back())
                        .finally(close)
                    }
                  >
                    <Btn loading={_report.remove.loading} className={cssUtils.colorError} icon="delete">
                      {m.delete}
                    </Btn>
                  </Confirm>
                )}
              </div>
            </ReportHeader>

            <Grid container spacing={2} alignItems="stretch">
              <Grid item xs={12} sm={6}>
                <ReportConsumer report={report} canEdit={connectedUser.isAdmin} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReportCompany report={report} canEdit={connectedUser.isAdmin} />
              </Grid>
            </Grid>

            <ReportDescription report={report} files={_report.get.entity?.files} />

            <Panel loading={_report.events.loading}>
              {_report.events.entity && _report.companyEvents.entity && (
                <>
                  <Tabs
                    className={css.tabs}
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
                      reportId={report.id}
                      response={response}
                      files={_report.get.entity?.files.filter(_ => _.origin === FileOrigin.Professional)}
                    />
                  </ReportTabPanel>
                  <ReportTabPanel value={activeTab} index={1}>
                    <ReportEvents events={[creationReportEvent(report), ..._report.events.entity]} />
                  </ReportTabPanel>
                  <ReportTabPanel value={activeTab} index={2}>
                    <ReportEvents events={_report.companyEvents.entity} />
                  </ReportTabPanel>
                </>
              )}
            </Panel>
          </>
        ))
        .getOrElse(<></>)}
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
