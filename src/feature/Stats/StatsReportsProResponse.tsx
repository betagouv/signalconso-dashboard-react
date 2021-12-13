import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScLineChart} from '../../shared/Chart/Chart'
import * as React from 'react'
import {useEffect} from 'react'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {CurveStatsParams, ReportStatus} from '@signal-conso/signalconso-api-sdk-js'
import {curveRatio, statsFormatCurveDate} from './Stats'

interface Props {
  ticks?: number
}

export const StatsReportsProResponsePanel = ({ticks}: Props) => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()


  const reportCountVisibleByProCurve = useFetcher((_: CurveStatsParams) =>
      api.public.stats.getReportCountCurve({
        ..._, status: [
          ReportStatus.TraitementEnCours,
          ReportStatus.Transmis,
          ReportStatus.PromesseAction,
          ReportStatus.Infonde,
          ReportStatus.NonConsulte,
          ReportStatus.ConsulteIgnore,
          ReportStatus.MalAttribue]
      }),
  )
  const reportCountMalAttribueCurve = useFetcher((_: CurveStatsParams) =>
      api.public.stats.getReportCountCurve({
        ..._, status: [ReportStatus.MalAttribue]
      }),
  )

  const reportCountInfondeCurve = useFetcher((_: CurveStatsParams) =>
      api.public.stats.getReportCountCurve({
        ..._, status: [ReportStatus.Infonde]
      }),
  )

  const reportCountPromesseActionCurve = useFetcher((_: CurveStatsParams) =>
      api.public.stats.getReportCountCurve({
        ..._, status: [ReportStatus.PromesseAction]
      }),
  )


  const fetchCurve = () => {
    reportCountVisibleByProCurve.fetch({}, {ticks})
    reportCountMalAttribueCurve.fetch({}, {ticks})
    reportCountInfondeCurve.fetch({}, {ticks})
    reportCountPromesseActionCurve.fetch({}, {ticks})
  }

  useEffect(() => {
    fetchCurve()
  }, [ticks])

  return (
    <Panel loading={reportCountVisibleByProCurve.loading || reportCountMalAttribueCurve.loading || reportCountInfondeCurve.loading || reportCountPromesseActionCurve.loading}>
      <PanelHead>{m.reportsProResponseType}</PanelHead>
      <PanelBody>
        {

            reportCountMalAttribueCurve.entity
            && reportCountInfondeCurve.entity
            && reportCountPromesseActionCurve.entity
            && reportCountVisibleByProCurve.entity && (
                <ScLineChart curves={[
                  {
                    label: m.reportsProMalAttribue,
                    key: 'mal_attribue',
                    curve: curveRatio(reportCountMalAttribueCurve.entity, reportCountVisibleByProCurve.entity).map(statsFormatCurveDate(m))
                  },
                  {
                    label: m.reportsProInfonde,
                    key: 'infonde',
                    curve: curveRatio(reportCountInfondeCurve.entity, reportCountVisibleByProCurve.entity).map(statsFormatCurveDate(m))
                  },
                  {
                    label: m.reportsProPromesseAction,
                    key: 'promesse_action',
                    curve: curveRatio(reportCountPromesseActionCurve.entity, reportCountVisibleByProCurve.entity).map(statsFormatCurveDate(m))
                  }
                ]}/>
            )}
      </PanelBody>
    </Panel>
  )
}
