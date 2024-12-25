import { AsyncLineChart } from 'shared/Chart/chartWrappers'
import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { Txt } from '../../alexlibs/mui-extension'
import { ReportTag } from '../../core/client/report/Report'
import { CountByDate } from '../../core/client/stats/statsTypes'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useI18n } from '../../core/i18n'

const computeCurveReportPhysique = ({
  all,
  internet,
  demarchages,
  influenceurs,
}: {
  all: CountByDate[]
  internet: CountByDate[]
  demarchages: CountByDate[]
  influenceurs: CountByDate[]
}) => {
  const res: CountByDate[] = []
  for (let i = 0; i < all.length; i++) {
    res[i] = {
      date: all[i].date,
      count:
        all[i].count -
        internet[i]?.count -
        demarchages[i]?.count -
        influenceurs[i]?.count,
    }
  }
  return res
}

export const StatsReportsCurvePanel = () => {
  const { api: api } = useConnectedContext()
  const { m } = useI18n()
  const tickDuration = 'Month'
  const ticks = 12
  const loadCurves = async () => {
    const [all, internet, demarchages, influenceurs] = await Promise.all([
      api.secured.stats.getReportCountCurve({
        ticks,
        tickDuration,
        withoutTags: [ReportTag.Bloctel],
      }),
      api.secured.stats.getReportCountCurve({
        ticks,
        tickDuration,
        withTags: [ReportTag.Internet],
        withoutTags: [ReportTag.Bloctel],
      }),
      api.secured.stats.getReportCountCurve({
        ticks,
        tickDuration,
        withTags: [
          ReportTag.DemarchageADomicile,
          ReportTag.DemarchageTelephonique,
          ReportTag.DemarchageInternet,
        ],
        withoutTags: [ReportTag.Bloctel],
      }),
      api.secured.stats.getReportCountCurve({
        ticks,
        tickDuration,
        withTags: [ReportTag.Influenceur],
        withoutTags: [ReportTag.Bloctel],
      }),
    ])
    return [
      {
        label: m.reportsCount,
        data: all,
      },
      {
        label: m.reportsCountInternet,
        data: internet,
      },
      {
        label: m.reportsCountDemarchage,
        data: demarchages,
      },
      {
        label: m.reportsCountInfluenceurs,
        data: influenceurs,
      },
      {
        label: m.reportsCountPhysique,
        data: computeCurveReportPhysique({
          all,
          internet,
          demarchages,
          influenceurs,
        }),
      },
    ]
  }
  return (
    <CleanWidePanel>
      <div className="font-bold text-xl mb-2">{m.reportsDivision}</div>
      <div>
        <Txt
          color="hint"
          gutterBottom
          block
          dangerouslySetInnerHTML={{ __html: m.reportsDivisionDesc }}
        />
        <AsyncLineChart {...{ loadCurves }} smallFontYAxis />
      </div>
    </CleanWidePanel>
  )
}
