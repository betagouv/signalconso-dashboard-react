import React, {useEffect, useState} from 'react'
import {Page} from '../../shared/Layout'
import {useParams} from 'react-router'
import {useI18n} from '../../core/i18n'
import {Panel, PanelBody} from '../../shared/Panel'
import {useReportContext} from '../../core/context/ReportContext'
import {FileOrigin, Id, Report} from 'core/api'
import {Divider, Grid, Icon, makeStyles, Tab, Tabs, Theme, useTheme} from '@material-ui/core'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import {Chip} from '../../shared/Chip/Chip'
import {PanelHead} from '../../shared/Panel/PanelHead'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
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
  const _report = useReportContext()
  const report: Report | undefined = _report.entity?.report
  const theme = useTheme()
  const cssUtils = useUtilsCss()
  const css = useStyles()
  const {toastError} = useToast()
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    _report.fetch()(id)
    _report.events.fetch()(id)
  }, [])

  useEffect(() => {
    fromNullable(_report.error).map(toastError)
  }, [_report.entity, _report.error])

  useEffect(() => {
    fromNullable(_report.removingError).map(toastError)
  }, [_report.removingError])

  const downloadReport = (reportId: Id) => {
    _report.download(reportId)
    //   .then((response: any) => {
    //   const blob = new Blob([response.body!], {type: 'application/pdf'})
    //   const link = document.createElement('a')
    //   link.href = window.URL.createObjectURL(blob)
    //   link.download = 'report.pdf'
    //   document.body.appendChild(link)
    //   link.click()
    //   document.body.removeChild(link)
    // })
  }

  return report ? (
    <Page>
      <Panel elevation={2}>
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
              <div className={cssUtils.txtBig} dangerouslySetInnerHTML={{__html: detail.label.replace(/\:$/, '')}}/>
              <div className={cssUtils.colorTxtSecondary} dangerouslySetInnerHTML={{__html: detail.value}}/>
            </div>
          )}
          <Divider className={cssUtils.divider}/>
          <ReportFiles
            attachements={_report.entity?.files}
            reportId={report.id}
            fileOrigin={FileOrigin.Professional}
            onNewFile={() => _report.events.fetch({force: true, clean: false})()}
          />
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
            onConfirm={() => _report.remove(report.id).then(() => window.history.back())}
          >
            <Btn loading={_report.removing} variant="outlined" color="error" icon="delete">{m.delete}</Btn>
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
                    <div className={cssUtils.txtBig}>{report.companySiret}</div>
                    <div className={cssUtils.txtBold} style={{marginTop: theme.spacing(1 / 2)}}>{report.companyName}</div>
                    <div className={classes(cssUtils.colorTxtSecondary)}>
                      <div>{report.companyAddress}</div>
                      <div>{report.companyPostalCode}</div>
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
      <Panel loading={_report.events.loading}>
        {fromNullable(_report.events.entity).map(events =>
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
              <ReportMessages events={events}/>
            </ReportTabPanel>
            <ReportTabPanel value={activeTab} index={1}>
              <ReportEvents events={events}/>
            </ReportTabPanel>
          </>
        ).toUndefined()}
      </Panel>
    </Page>
  ) : <></>
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
