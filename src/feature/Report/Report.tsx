import React, {useEffect, useMemo, useState} from 'react'
import {Page} from '../../shared/Layout'
import {useParams} from 'react-router'
import {useI18n} from '../../core/i18n'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {useReportContext} from '../../core/context/ReportContext'
import {EventActionValues, FileOrigin, Id, Report, ReportEvent} from 'core/api'
import {Grid, Icon, makeStyles, Tab, Tabs, Theme, Tooltip, useTheme} from '@material-ui/core'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {capitalize, classes} from '../../core/helper/utils'
import {ScButton} from '../../shared/Button/Button'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {fromNullable} from 'fp-ts/lib/Option'
import {useToast} from '../../core/toast'
import {ReportEvents} from './Event/ReportEvents'
import {ReportMessages} from './ReportMessages'
import {AddressComponent} from '../../shared/Address/Address'
import {SelectCompany} from '../../shared/SelectCompany/SelectCompany'
import {EditConsumerDialog} from './EditConsumerDialog'
import {ReportHeader} from './ReportHeader'
import {Btn, Confirm} from 'mui-extension/lib'
import {ReportAddComment} from './ReportAddComment'

const useStyles = makeStyles((t: Theme) => ({
  cardBody: {
    display: 'flex',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  cardBody_icon: {
    fontSize: 64,
    // color: t.palette.primary.main,
    color: t.palette.divider,
  },
  tabs: {
    borderBottom: '1px solid ' + t.palette.divider,
  },
}))

export const creationReportEvent = (report: Report): ReportEvent => Object.freeze({
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
  const cssUtils = useCssUtils()
  const css = useStyles()
  const {toastError} = useToast()
  const [activeTab, setActiveTab] = useState(0)
  const response = useMemo(() => _report.events.entity?.find(_ => _.data.action === EventActionValues.ReportProResponse), [_report.events])

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
  }, [
    _report.remove.error,
    _report.get.error,
    _report.updateCompany.error,
    _report.companyEvents.error,
    _report.events.error,
  ])

  const downloadReport = (reportId: Id) => _report.download.fetch({}, reportId)

  return (
    <Page loading={_report.get.loading}>
      {fromNullable(_report.get.entity?.report).map(report =>
        <>
          <ReportHeader
            elevated
            report={report}
            files={_report.get.entity?.files}
            actions={
              <>
                <ReportAddComment report={report} onAdd={() => _report.events.fetch({force: true, clean: false}, id)}>
                  <Tooltip title={m.addDgccrfComment}>
                    <Btn variant="outlined" color="primary" icon="add_comment">
                      {m.comment}
                    </Btn>
                  </Tooltip>
                </ReportAddComment>
                <Btn
                  variant="outlined" color="primary" icon="download"
                  loading={_report.download.loading}
                  onClick={() => downloadReport(report.id)}
                >
                  {m.download}
                </Btn>
                <Confirm
                  title={m.removeAsk}
                  content={m.removeReportDesc(report.companySiret)}
                  onConfirm={(close) => _report.remove.fetch({}, report.id).then(() => window.history.back()).finally(close)}
                >
                  <Btn loading={_report.remove.loading} variant="outlined" color="error" icon="delete">{m.delete}</Btn>
                </Confirm>
              </>
            }/>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} sm={6}>
              <Panel stretch>
                <PanelHead>{m.consumer}</PanelHead>
                <PanelBody className={css.cardBody}>
                  <div>
                    <div className={cssUtils.txtBig}>
                      {fromNullable(report.firstName).map(_ => capitalize(_)).getOrElse('')}
                      &nbsp;
                      {fromNullable(report.lastName).map(_ => _.toLocaleUpperCase()).getOrElse('')}
                    </div>
                    <div className={cssUtils.colorTxtSecondary}>{report.email}</div>
                    {!report.contactAgreement && (
                      <div className={classes(cssUtils.colorError)} style={{marginTop: theme.spacing(.5)}}>
                        <Icon className={cssUtils.inlineIcon}>warning</Icon>
                        &nbsp;
                        {m.reportConsumerWantToBeAnonymous}
                      </div>
                    )}
                  </div>
                  <Icon className={css.cardBody_icon}>person</Icon>
                </PanelBody>
                <PanelFoot>
                  <EditConsumerDialog report={report} onChange={user => _report.updateConsumer.fetch({},
                    report.id,
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.contactAgreement,
                  )}>
                    <ScButton icon="edit" color="primary" loading={_report.updateConsumer.loading}>{m.edit}</ScButton>
                  </EditConsumerDialog>
                </PanelFoot>
              </Panel>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Panel stretch>
                <PanelHead>{m.company}</PanelHead>
                <PanelBody className={css.cardBody}>
                  <div>
                    <div className={cssUtils.txtBig} style={{marginBottom: theme.spacing(1 / 2)}}>{report.companySiret}</div>
                    <div className={classes(cssUtils.colorTxtSecondary, cssUtils.txtSmall)}>
                      <div className={cssUtils.txtBold}>{report.companyName}</div>
                      <AddressComponent address={report.companyAddress}/>
                    </div>
                    <div>{report.vendor}</div>
                  </div>
                  <Icon className={css.cardBody_icon}>store</Icon>
                </PanelBody>
                <PanelFoot>
                  <SelectCompany companyId={report.companyId} onChange={company => {
                    _report.updateCompany.fetch({}, report.id, company)
                  }}>
                    <ScButton icon="edit" color="primary" loading={_report.updateCompany.loading}>{m.edit}</ScButton>
                  </SelectCompany>
                </PanelFoot>
              </Panel>
            </Grid>
          </Grid>
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
                  <Tab label={m.proResponse}/>
                  <Tab label={m.reportHistory}/>
                  <Tab label={m.companyHistory}/>
                </Tabs>
                <ReportTabPanel value={activeTab} index={0}>
                  <ReportMessages
                    canEditFile
                    reportId={report.id}
                    response={response}
                    files={_report.get.entity?.files.filter(_ => _.origin === FileOrigin.Professional)}
                  />
                </ReportTabPanel>
                <ReportTabPanel value={activeTab} index={1}>
                  <ReportEvents events={[creationReportEvent(report), ..._report.events.entity]}/>
                </ReportTabPanel>
                <ReportTabPanel value={activeTab} index={2}>
                  <ReportEvents events={_report.companyEvents.entity}/>
                </ReportTabPanel>
              </>
            )}
          </Panel>
        </>,
      ).getOrElse(<></>)}
    </Page>
  )
}

interface ReportTabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
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
      {value === index && (
        children
      )}
    </div>
  )
}
