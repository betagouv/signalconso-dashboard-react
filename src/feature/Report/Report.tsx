import React, {useEffect, useState} from 'react'
import {Page} from '../../shared/Layout'
import {useParams} from 'react-router'
import {useI18n} from '../../core/i18n'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {useReportContext} from '../../core/context/ReportContext'
import {FileOrigin, Id} from 'core/api'
import {Divider, Grid, Icon, makeStyles, Tab, Tabs, Theme, useTheme} from '@material-ui/core'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import {Chip} from '../../shared/Chip/Chip'
import {useCssUtils} from '../../core/utils/useCssUtils'
import {capitalize, classes} from '../../core/helper/utils'
import {ScButton} from '../../shared/Button/Button'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {Alert, Btn, Confirm} from 'mui-extension/lib'
import {ReportCategories} from './ReportCategories'
import {ReportFiles} from './File/ReportFiles'
import {fromNullable} from 'fp-ts/lib/Option'
import {utilsStyles} from '../../core/theme'
import {useToast} from '../../core/toast'
import {ReportEvents} from './Event/ReportEvents'
import {ReportMessages} from './ReportMessages'
// import SwipeableViews from 'react-swipeable-views';

const useStyles = makeStyles((t: Theme) => ({
  pageTitle: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: t.spacing(2),
  },
  pageTitle_txt: {
    margin: 0,
    fontSize: utilsStyles(t).fontSize.bigTitle
  },
  cardBody: {
    display: 'flex',
    justifyContent: 'space-between'
    // alignItems: 'center',
  },
  cardBody_icon: {
    fontSize: 64,
    // color: t.palette.primary.main,
    color: t.palette.divider,
  },
  tabs: {
    borderBottom: '1px solid ' + t.palette.divider,
  }
}))


export const ReportComponent = () => {
  const {id} = useParams<{id: Id}>()
  const {m, formatDate} = useI18n()
  const _report = useReportContext().get
  const _reportRemove = useReportContext().remove
  const _events = useReportContext().events
  const _reportDownload = useReportContext().download
  const theme = useTheme()
  const cssUtils = useCssUtils()
  const css = useStyles()
  const {toastError} = useToast()
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    _report.fetch()(id)
    _events.fetch()(id)
  }, [])

  useEffect(() => {
    fromNullable(_report.error).map(toastError)
  }, [_report.entity, _report.error])

  useEffect(() => {
    fromNullable(_reportRemove.error).map(toastError)
  }, [_reportRemove.error])

  const downloadReport = (reportId: Id) => _reportDownload.fetch()(reportId)

  return fromNullable(_report.entity?.report).map(report =>
    <Page>
      <Panel elevation={3}>
        <PanelBody>
          <div className={css.pageTitle}>
            <div>
              <h1 className={css.pageTitle_txt}>
                {m.report_pageTitle}&nbsp;
                <span>{report.companySiret}</span>
              </h1>
              <div className={cssUtils.colorTxtHint}>ID {id}</div>
            </div>
            <ReportStatusChip className={cssUtils.marginLeftAuto} status={report.status}/>
          </div>
          <Alert dense type="info" deletable className={cssUtils.marginBottom}>
            {m.reportCategoriesAreSelectByConsumer}
          </Alert>
          <ReportCategories categories={[report.category, ...report.subcategories]}/>
          <Divider className={cssUtils.divider}/>
          {report.details.map((detail, i) =>
            <div key={i} className={cssUtils.marginBottom}>
              <div className={cssUtils.txtBold} dangerouslySetInnerHTML={{__html: detail.label.replace(/\:$/, '')}}/>
              <div className={cssUtils.colorTxtSecondary} dangerouslySetInnerHTML={{__html: detail.value}}/>
            </div>
          )}
          <Divider className={cssUtils.divider}/>
          {fromNullable(_report.entity?.files.filter(_ => _.origin === FileOrigin.Consumer))
            .filter(_ => _.length > 0)
            .map(files =>
              <ReportFiles
                files={files}
                reportId={report.id}
                fileOrigin={FileOrigin.Consumer}
                onNewFile={() => _events.fetch({force: true, clean: false})(report.id)}
              />
            ).toUndefined()
          }
        </PanelBody>
        <PanelFoot>
          <div style={{flex: 1}}>
            {report.tags.map(tag => [
              <Chip icon={<Icon style={{fontSize: 20}} className={cssUtils.colorTxtHint}>sell</Icon>} key={tag} label={tag}/>,
              ' '
            ])}
          </div>

          <Btn variant="outlined" color="primary" icon="download" onClick={() => downloadReport(report.id)}>
            {m.download}
          </Btn>
          <Confirm
            title={m.removeAsk}
            content={m.removeReportDesc(report.companySiret)}
            onConfirm={() => _reportRemove.fetch()(report.id).then(() => window.history.back())}
          >
            <Btn loading={_reportRemove.loading} variant="outlined" color="error" icon="delete">{m.delete}</Btn>
          </Confirm>
        </PanelFoot>
          </Panel>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} sm={6}>
              <Panel stretch>
                <PanelHead>{m.consumer}</PanelHead>
                <PanelBody className={css.cardBody}>
                  <div>
                    <div className={cssUtils.txtBig}>{capitalize(report.firstName)}&nbsp;{report.lastName.toLocaleUpperCase()}</div>
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
                  <ScButton icon="edit" color="primary">{m.edit}</ScButton>
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
                      {report.companyAddress?.split(' - ').map((address, i) =>
                        <div key={i} className={classes(i === 0 && cssUtils.txtBold)}>{address}</div>
                      )}
                      <div>{report.companyCountry}</div>
                    </div>
                    <div>{report.vendor}</div>
                  </div>
                  <Icon className={css.cardBody_icon}>store</Icon>
                </PanelBody>
                <PanelFoot>
                  <ScButton icon="edit" color="primary">{m.edit}</ScButton>
                </PanelFoot>
              </Panel>
            </Grid>
          </Grid>
      <Panel loading={_events.loading}>
        {fromNullable(_events.entity).map(events =>
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
            </Tabs>
            <ReportTabPanel value={activeTab} index={0}>
              <ReportMessages reportId={report.id} events={events} files={_report.entity?.files}/>
            </ReportTabPanel>
            <ReportTabPanel value={activeTab} index={1}>
              <ReportEvents report={report} events={events}/>
            </ReportTabPanel>
          </>
        ).toUndefined()}
      </Panel>
    </Page>
  ).getOrElse(<></>)
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
