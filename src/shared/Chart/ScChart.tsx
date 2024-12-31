import { Box, Checkbox, Theme, useTheme } from '@mui/material'
import { I18nContextShape } from 'core/i18n/i18nContext'
import format from 'date-fns/format'
import { memo, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CountByDate, Period } from '../../core/client/stats/statsTypes'
import { useI18n } from '../../core/i18n'
import { styleUtils } from '../../core/theme'

interface ScChartPropsBase {
  /**
   * This props may be needed because sometimes label are not showing because of animation.
   * https://github.com/recharts/recharts/issues/1135
   */
  disableAnimation?: boolean
  hideLabelToggle?: boolean
  height?: number
  smallFontYAxis?: boolean
}

interface Props extends ScChartPropsBase {
  period?: Period
  curves: {
    label: string
    key: string
    curve: CountByDate[]
    color?: string
  }[]
  chartKind?: ScChartKind
}
export type ScChartKind = 'linechart' | 'stackedbarchart'

// INSPIRED FROM https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
function getWeek(date: Date): [number, number] {
  // Copy date so don't modify original
  const d: Date = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  )
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  // Get first day of year
  const yearStart: Date = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  // Calculate full weeks to nearest Thursday
  const weekNo: number = Math.ceil(
    ((d.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7,
  )
  // Return week number and year
  return [d.getUTCFullYear(), weekNo]
}

const formatDate = (
  m: I18nContextShape['m'],
  date: Date,
  period?: Period,
): string => {
  switch (period) {
    case 'Day':
      return format(date, 'yyyy-MM-dd')
    case 'Week':
      const [y, w] = getWeek(date)
      return `S${w} ${y}`
    case 'Month':
    case undefined:
      return (m.monthShort_ as any)[date.getMonth() + 1]
  }
}

const colors = (t: Theme) => [t.palette.primary.main, '#e48c00', 'red', 'green']

export const ScChart = memo(
  ({
    period,
    disableAnimation,
    hideLabelToggle,
    curves,
    height = 300,
    smallFontYAxis,
    chartKind = 'linechart',
  }: Props) => {
    const theme = useTheme()
    const [showCurves, setShowCurves] = useState<boolean[]>(
      new Array(curves.length).fill(false),
    )
    const { m } = useI18n()
    const mappedData = useMemo(() => {
      const res: any[] = []
      curves.forEach((curve, i) => {
        curve.curve.forEach((data, j) => {
          if (!res[j])
            res[j] = { date: formatDate(m, data.date, period) } as any
          res[j][curve.key] = data.count
        })
        res.push()
      })
      return res
    }, [curves])

    // the labels may go a little bit outside the graph
    const margin = hideLabelToggle ? undefined : { top: 20, right: 20 }

    const ChartComponent =
      chartKind === 'stackedbarchart' ? BarChart : LineChart

    return (
      <>
        {!hideLabelToggle && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {m.showLabels}
            {curves.map((c, i) => (
              <Checkbox
                key={c.key}
                checked={showCurves[i]}
                onChange={(e) =>
                  setShowCurves((prev) =>
                    prev.map((_, index) =>
                      i === index ? e.currentTarget.checked : _,
                    ),
                  )
                }
                sx={{
                  '& svg': {
                    fill:
                      c.color ??
                      colors(theme)[i] ??
                      colors(theme)[0] + ' !important',
                  },
                }}
              />
            ))}
          </Box>
        )}
        <div style={{ height }} className="">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={mappedData} margin={margin}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis {...(smallFontYAxis && { fontSize: '0.85em' })} />
              <Tooltip />
              <Legend />
              {curves.map((_, i) => {
                const color = _.color ?? colors(theme)[i] ?? colors(theme)[0]
                const props = {
                  isAnimationActive: disableAnimation,

                  name: _.label,
                  type: 'monotone',
                  dataKey: _.key,
                  children: showCurves[i] && (
                    <LabelList
                      dataKey={_.key}
                      position="top"
                      style={{
                        fill: color,
                        fontSize: styleUtils(theme).fontSize.small,
                      }}
                    />
                  ),
                } as const

                const key = _.key
                return chartKind === 'stackedbarchart' ? (
                  <Bar {...props} key={key} fill={color} stackId="a" />
                ) : (
                  <Line {...props} key={key} stroke={color} strokeWidth={2} />
                )
              })}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </>
    )
  },
)
