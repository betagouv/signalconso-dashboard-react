import React, {useEffect} from 'react'
import {Page} from '../../shared/Layout'
import {useParams} from 'react-router'
import {useI18n} from '../../core/i18n'
import {Panel, PanelBody} from '../../shared/Panel'
import {useReportContext} from '../../core/context/ReportContext'
import {Id, Report} from 'core/api'
import {Divider, Grid, Icon, makeStyles, Theme, useTheme} from '@material-ui/core'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import {Chip} from '../../shared/Chip/Chip'
import {PanelTitle} from '../../shared/Panel/PanelTitle'
import {ReportEventComponent} from './ReportEvent'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {capitalize, classes} from '../../core/helper/utils'
import {ScButton} from '../../shared/Button/Button'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {Alert, Btn, Confirm} from 'mui-extension/lib'
import {ReportCategories} from './ReportCategories'
import {ReportAttachements} from './ReportAttachements'
import {fromNullable} from 'fp-ts/lib/Option'
import {utilsStyles} from '../../core/theme'
import {useToast} from '../../core/toast'
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
            {report.details.map(detail =>
              <div className={cssUtils.marginBottom}>
                <div className={cssUtils.txtBig} dangerouslySetInnerHTML={{__html: detail.label.replace(/\:$/, '')}}/>
                <div className={cssUtils.colorTxtSecondary} dangerouslySetInnerHTML={{__html: detail.value}}/>
              </div>
            )}
            {fromNullable(_report.entity?.files).map(_ => _.length > 0 && (
              <>
                <Divider className={cssUtils.divider}/>
                <ReportAttachements attachements={_}/>
              </>
            )).toUndefined()}
          </PanelBody>
          <PanelFoot>
            <div style={{flex: 1}}>
              {report.tags.map(tag => [
                <Chip icon={<Icon style={{fontSize: 20}} className={cssUtils.colorTxtHint}>sell</Icon>} key={tag} label={tag}/>,
                ' '
              ])}
            </div>

            <Btn variant="outlined" color="primary" icon="download">{m.download}</Btn>
            <Confirm
              title={m.removeAsk}
              content={m.removeReportDesc(report.companySiret)}
              onConfirm={() => _report.remove(report.id).then(() => window.history.back())}
            >
              <Btn loading={_report.removing} variant="contained" color="primary" icon="delete">{m.delete}</Btn>
            </Confirm>
          </PanelFoot>
          </Panel>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} sm={6}>
              <Panel stretch>
                <PanelTitle>{m.consumer}</PanelTitle>
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
                <PanelTitle>{m.company}</PanelTitle>
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
          {/*<Panel>*/}
          {/*  <Tabs*/}
          {/*    value={value}*/}
          {/*    onChange={handleChange}*/}
          {/*    indicatorColor="primary"*/}
          {/*    textColor="primary"*/}
          {/*    variant="fullWidth"*/}
          {/*  >*/}
          {/*    <Tab label="Item Two"/>*/}
          {/*    <Tab label="Item Three"/>*/}
          {/*  </Tabs>*/}
          {/*  <SwipeableViews*/}
          {/*    index={value}*/}
          {/*    onChangeIndex={handleChangeIndex}*/}
          {/*  >*/}
          {/*    <TabPanel value={value} index={0} dir={theme.direction}>*/}
          {/*      Item One*/}
          {/*    </TabPanel>*/}
          {/*    <TabPanel value={value} index={1} dir={theme.direction}>*/}
          {/*      Item Two*/}
          {/*    </TabPanel>*/}
          {/*    <TabPanel value={value} index={2} dir={theme.direction}>*/}
          {/*      Item Three*/}
          {/*    </TabPanel>*/}
        {/*  </SwipeableViews>*/}
        {/*</Panel>*/}
        <Panel loading={_report.events.loading}>
          <PanelTitle>{m.reportHistory}</PanelTitle>
          <PanelBody>
            {_report.events.entity?.map(event =>
              <ReportEventComponent event={event}/>
            )}
          </PanelBody>
        </Panel>
      </Page>
    )
    : <></>
}
