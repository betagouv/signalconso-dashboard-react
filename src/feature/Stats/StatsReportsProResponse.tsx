import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import * as React from 'react'
import {useEffect} from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {statsFormatCurveDate} from './Stats'
import {curveRatio} from './ReportStats'
import {ReportResponseStatsParams} from '@signal-conso/signalconso-api-sdk-js'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {ChartAsync} from '../../shared/Chart/ChartAsync'

interface Props {
  ticks?: number
}

export const StatsReportsProResponsePanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()

  const reportResponseCountCurve = useFetcher(api.secured.stats.getProReportResponseStat)

  const reportCountMalAttribueCurve = useFetcher((_: ReportResponseStatsParams) =>
    api.secured.stats.getProReportResponseStat({
      ..._,
      responseStatusQuery: ['NOT_CONCERNED'],
    }),
  )

  const reportCountInfondeCurve = useFetcher((_: ReportResponseStatsParams) =>
    api.secured.stats.getProReportResponseStat({
      ..._,
      responseStatusQuery: ['REJECTED'],
    }),
  )

  const reportCountPromesseActionCurve = useFetcher((_: ReportResponseStatsParams) =>
    api.secured.stats.getProReportResponseStat({
      ..._,
      responseStatusQuery: ['ACCEPTED'],
    }),
  )

  const fetchCurve = () => {
    reportCountMalAttribueCurve.fetch({}, {ticks})
    reportCountInfondeCurve.fetch({}, {ticks})
    reportCountPromesseActionCurve.fetch({}, {ticks})
    reportResponseCountCurve.fetch({}, {ticks})
  }

  useEffect(() => {
    fetchCurve()
  }, [ticks])

  return (
    <Panel
      loading={
        reportResponseCountCurve.loading ||
        reportCountMalAttribueCurve.loading ||
        reportCountInfondeCurve.loading ||
        reportCountPromesseActionCurve.loading
      }
    >
      <PanelHead>{m.reportsProResponseType}</PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsProResponseTypeDesc}} />
        <ChartAsync
          disableAnimation
          promisesDeps={[ticks]}
          promises={[
            () => api.secured.stats.getProReportResponseStat({ticks}),
            () =>
              api.secured.stats.getProReportResponseStat({
                ticks,
                responseStatusQuery: ['NOT_CONCERNED'],
              }),
            () =>
              api.secured.stats.getProReportResponseStat({
                ticks,
                responseStatusQuery: ['REJECTED'],
              }),
            () =>
              api.secured.stats.getProReportResponseStat({
                ticks,
                responseStatusQuery: ['ACCEPTED'],
              }),
          ]}
          curves={[
            {
              label: m.reportsProMalAttribue,
              key: 'mal_attribue',
              curve: promises => curveRatio(promises[1], promises[0]).map(statsFormatCurveDate(m)),
            },
            {
              label: m.reportsProInfonde,
              key: 'infonde',
              curve: promises => curveRatio(promises[2], promises[0]).map(statsFormatCurveDate(m)),
            },
            {
              label: m.reportsProPromesseAction,
              key: 'promesse_action',
              curve: promises => curveRatio(promises[3], promises[0]).map(statsFormatCurveDate(m)),
            },
          ]}
        />
      </PanelBody>
    </Panel>
  )
}
