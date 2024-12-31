import { Skeleton } from '@mui/material'
import { useEffect, useState } from 'react'
import { CountByDate, Period } from '../../core/client/stats/statsTypes'
import { ScChart, ScChartKind } from './ScChart'

export const toPercentage = (
  numerator: CountByDate[],
  denominator: CountByDate[],
): CountByDate[] => {
  return numerator.map<CountByDate>((k, i) => ({
    date: k.date,
    count:
      denominator[i] && denominator[i].count > 0
        ? Math.min(Math.round((k.count / denominator[i].count) * 100), 100)
        : 0,
  }))
}

export interface CurveDefinition {
  label: string
  data: CountByDate[]
  color?: string
}

interface ChartOrPlaceholderProps {
  period?: Period
  curves?: CurveDefinition[]
  hideLabelToggle?: boolean
  smallFontYAxis?: boolean
  chartKind?: ScChartKind
}

// Displays the data, or a loading placeholder if the data is undefined
// For complex needs, when you need to fully control the loading of the data in the parent component
export const ChartOrPlaceholder = ({
  curves,
  ...rest
}: ChartOrPlaceholderProps) => {
  const height = 300
  return curves ? (
    <ScChart
      {...{ height }}
      disableAnimation={true}
      curves={curves.map(({ data, ...rest }, idx) => {
        return {
          key: idx.toString(),
          curve: data,
          ...rest,
        }
      })}
      {...rest}
    />
  ) : (
    <Skeleton
      variant="rectangular"
      height={height}
      width="100%"
      sx={{ borderRadius: '8px' }}
    />
  )
}

type AsyncLineChartProps = {
  loadCurves: () => Promise<CurveDefinition[]>
  hideLabelToggle?: boolean
  smallFontYAxis?: boolean
}

// You provide one loading function that returns all the data
// Useful when you need to compute some curve based on the data from some other curve
export const AsyncLineChart = ({
  loadCurves,
  ...rest
}: AsyncLineChartProps) => {
  const [curves, setCurves] = useState<CurveDefinition[] | undefined>(undefined)
  useEffect(() => {
    loadCurves().then(setCurves)
  }, [])
  return <ChartOrPlaceholder curves={curves} {...rest} />
}

interface SimplifiedAsyncLineChartProps {
  curves: {
    label: string
    loadData: () => Promise<CountByDate[]>
  }[]
  hideLabelToggle?: boolean
  smallFontYAxis?: boolean
}

// You provide a loading function for each line
// Easiest to use, but sometimes not always flexible enough
export const SimplifiedAsyncLineChart = ({
  curves,
  ...rest
}: SimplifiedAsyncLineChartProps) => {
  const loadCurves = () =>
    Promise.all(
      curves.map(({ loadData, ...rest }) => {
        return loadData().then((data) => ({ data, ...rest }))
      }),
    )
  return <AsyncLineChart {...{ loadCurves }} {...rest} />
}
