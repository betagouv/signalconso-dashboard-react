import React, {useEffect} from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {useParams} from 'react-router'
import {useI18n} from '../../core/i18n'
import {Panel, PanelContent} from '../../shared/Panel'
import {useReportContext} from '../../core/context/ReportContext'
import {Id, Report} from '@signalconso/signalconso-api-sdk-js/build'
import {Divider, makeStyles, Theme} from '@material-ui/core'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import {Chip} from '../../shared/Chip/Chip'
import {PanelTitle} from '../../shared/Panel/PanelTitle'
import {ReportEventComponent} from './ReportEvent'

const useStyles = makeStyles((t: Theme) => ({}))

export const ReportComponent = () => {
  const {id} = useParams<{id: Id}>()
  const {m, formatDate} = useI18n()
  const _report = useReportContext()
  const report: Report | undefined = _report.entity?.report

  useEffect(() => {
    _report.fetch()(id)
    _report.events.fetch()(id)
  }, [])

  return (
    <Page>
      <PageTitle>{m.report_pageTitle(id)}</PageTitle>

      {report && (
        <>
          <Panel>
            <PanelContent>
              <ReportStatusChip status={report.status}/>
              {JSON.stringify(_report.entity)}
            </PanelContent>
            <Divider/>
            <PanelContent>
              {report.tags.map(tag => <Chip key={tag} label={tag}/>)}
            </PanelContent>
          </Panel>
          <Panel loading={_report.events.loading}>
            <PanelTitle>{m.reportHistory}</PanelTitle>
            <PanelContent>
              {_report.events.entity?.map(event =>
                <ReportEventComponent event={event}/>
              )}
            </PanelContent>
          </Panel>
        </>
      )}
    </Page>
  )
}
