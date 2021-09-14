import * as React from 'react'
import {useEffect} from 'react'
import {Page, PageTitle} from 'shared/Layout'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useParams} from 'react-router'
import {EventActionValues, Id} from '../../core/api'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {HorizontalBarChart} from '../../shared/HorizontalBarChart/HorizontalBarChart'
import {reportStatusColor} from '../../shared/ReportStatus/ReportStatus'
import {useI18n} from '../../core/i18n'
import {Enum} from '@alexandreannic/ts-utils/lib/common/enum/Enum'
import {Grid, makeStyles, Theme} from '@material-ui/core'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {CompanyReportsCountPanel} from './CompanyReportsCountPanel'
import {useCompaniesStatsContext} from '../../core/context/CompanyStatsContext'
import {useMemoFn} from '../../shared/hooks/UseMemoFn'
import {useEventContext} from '../../core/context/EventContext'
import {useEffectFn} from '../../shared/hooks/UseEffectFn'

const useStyles = makeStyles((t: Theme) => ({
  cardValue: {
    fontSize: 36,
    lineHeight: 1,
  },
}))

export const CompanyComponent = () => {
  const {id} = useParams<{id: Id}>()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const _company = useCompaniesContext()
  const _companyStats = useCompaniesStatsContext()
  const _event = useEventContext()
  const css = useStyles()
  const company = _company.byId.entity

  useEffect(() => {
    _company.byId.fetch({}, id)
    _companyStats.reportsCountEvolution.fetch({}, id, 'month')
    _companyStats.tags.fetch({}, id)
    _companyStats.hosts.fetch({}, id)
    _companyStats.status.fetch({}, id)
  }, [])

  useEffectFn(_company.byId.entity, _ => _event.companyEvents.fetch({}, _.siret))

  const postActivationDocEvents = useMemoFn(_event.companyEvents.entity, events => events
    .map(_ => _.data)
    .filter(_ => _.action === EventActionValues.PostAccountActivationDoc),
  )

  const statusDistribution = useMemoFn(_companyStats.status.entity, _ => Enum.entries(_).map(([status, count]) =>
    ({label: m.reportStatusShort[status], value: count, color: reportStatusColor[status] ?? undefined}),
  ))

  const tagsDistribution = useMemoFn(_companyStats.tags.entity, _ => Object.entries(_).map(([label, count]) => ({label, value: count})))

  return (
    <Page loading={_company.byId.loading}>
      <PageTitle>
        <div>
          {company?.name}
          <Txt block size="big" color="hint">{company?.siret}</Txt>
        </div>
      </PageTitle>

      {(_company.byId.entity && company) && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Panel>
                <PanelBody>
                  <Txt block uppercase color="hint" size="small" gutterBottom>{m.reports}</Txt>
                  <Txt className={css.cardValue}>{formatLargeNumber(company.count)}</Txt>
                </PanelBody>
              </Panel>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Panel>
                <PanelBody>
                  <Txt block uppercase color="hint" size="small" gutterBottom>{m.activationDocReturned}</Txt>
                  <Txt skeleton={_event.companyEvents.loading} className={css.cardValue}>
                    {postActivationDocEvents?.length}
                  </Txt>
                </PanelBody>
              </Panel>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Panel>
                <PanelBody>

                </PanelBody>
              </Panel>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Panel>
                <PanelBody>

                </PanelBody>
              </Panel>
            </Grid>
          </Grid>
          <CompanyReportsCountPanel
            period={_companyStats.reportsCountEvolutionPeriod}
            data={_companyStats.reportsCountEvolution.entity}
            onChange={period => _companyStats.reportsCountEvolution.fetch({}, id, period)}
          />
          <Panel>
            <PanelHead>{m.status}</PanelHead>
            <PanelBody>
              <HorizontalBarChart data={statusDistribution} grid/>
            </PanelBody>
          </Panel>
          <Panel>
            <PanelHead>{m.tags}</PanelHead>
            <PanelBody>
              <HorizontalBarChart data={tagsDistribution} grid/>
            </PanelBody>
          </Panel>
          {/*<Panel>*/}
          {/*  <PanelBody>{stats.hosts?.map(host => (*/}
          {/*    <>*/}
          {/*      <Txt key={host}>{host}</Txt>*/}
          {/*      &nbsp;*/}
          {/*    </>*/}
          {/*  ))}</PanelBody>*/}
          {/*</Panel>*/}
        </>
      )}
    </Page>
  )
}
