import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScLineChart} from '../../shared/Chart/Chart'
import * as React from 'react'
import {useEffect} from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {statsFormatCurveDate} from './Stats'
import {curveRatio} from './ReportStats'
import {ReportResponseStatsParams} from '@signal-conso/signalconso-api-sdk-js'
import {Txt} from 'mui-extension/lib/Txt/Txt'

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
        {reportCountMalAttribueCurve.entity &&
          reportCountInfondeCurve.entity &&
          reportCountPromesseActionCurve.entity &&
          reportResponseCountCurve.entity && (
            <ScLineChart
              curves={[
                {
                  label: m.reportsProMalAttribue,
                  key: 'mal_attribue',
                  curve: curveRatio(reportCountMalAttribueCurve.entity, reportResponseCountCurve.entity).map(
                    statsFormatCurveDate(m),
                  ),
                },
                {
                  label: m.reportsProInfonde,
                  key: 'infonde',
                  curve: curveRatio(reportCountInfondeCurve.entity, reportResponseCountCurve.entity).map(statsFormatCurveDate(m)),
                },
                {
                  label: m.reportsProPromesseAction,
                  key: 'promesse_action',
                  curve: curveRatio(reportCountPromesseActionCurve.entity, reportResponseCountCurve.entity).map(
                    statsFormatCurveDate(m),
                  ),
                },
              ]}
            />
          )}
      </PanelBody>
    </Panel>
  )
}
