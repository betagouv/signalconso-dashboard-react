import {Bar, BarChart, CartesianGrid, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import * as React from 'react'
import {memo, useMemo, useState} from 'react'
import {Box, Checkbox, Theme, useTheme} from '@mui/material'
import {styleUtils} from '../../core/theme'
import {useI18n} from '../../core/i18n'

export interface ScLineChartPropsBase {
  hideLabelToggle?: boolean
  height?: number
}

interface Props extends ScLineChartPropsBase {
  curves: {
    label: string
    key: string
    curve: {date: string; count: number}[]
    color?: string
  }[]
}

const colors = (t: Theme) => [t.palette.primary.main, '#e48c00', 'red', 'green']

export const ScLineChart = memo(({hideLabelToggle, curves, height = 300}: Props) => {
  const theme = useTheme()
  const [showCurves, setShowCurves] = useState<boolean[]>(new Array(curves.length).fill(false))
  const {m} = useI18n()
  const mappedData = useMemo(() => {
    const res: any[] = []
    curves.forEach((curve, i) => {
      curve.curve.forEach((data, j) => {
        if (!res[j]) res[j] = {date: data.date} as any
        res[j][curve.key] = data.count
      })
      res.push()
    })
    return res
  }, [curves])

  return (
    <>
      {!hideLabelToggle && (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
          {m.showLabels}
          {curves.map((c, i) => (
            <>
              <Checkbox
                key={c.key}
                checked={showCurves[i]}
                onChange={e => setShowCurves(prev => prev.map((_, index) => (i === index ? e.currentTarget.checked : _)))}
                sx={{'& svg': {fill: c.color ?? colors(theme)[i] ?? colors(theme)[0] + ' !important'}}}
              />
            </>
          ))}
        </Box>
      )}
      <Box sx={{height}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500} height={height - 60} data={mappedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {curves.map((_, i) => (
              <Line
                key={_.key}
                name={_.label}
                type="monotone"
                dataKey={_.key}
                stroke={_.color ?? colors(theme)[i] ?? colors(theme)[0]}
                strokeWidth={2}
              >
                {showCurves[i] && (
                  <LabelList
                    dataKey={_.key}
                    position="top"
                    style={{
                      fill: _.color ?? colors(theme)[i] ?? colors(theme)[0],
                      fontSize: styleUtils(theme).fontSize.small,
                    }}
                  />
                )}
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </>
  )
})

export const ScBarChart = ({curves, height}: Props) => {
  const theme = useTheme()

  const mappedData = useMemo(() => {
    const res: any[] = []
    curves.forEach((curve, i) => {
      curve.curve.forEach((data, j) => {
        if (!res[j]) res[j] = {date: data.date} as any
        res[j][curve.key] = data.count
      })
      res.push()
    })
    return res
  }, [curves])

  return (
    <div style={{height: height ?? 300}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={500} height={300} data={mappedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend wrapperStyle={{position: 'relative', marginTop: -16}} />
          {curves.map((_, i) => (
            <Bar
              stackId="_"
              key={_.key}
              name={_.label}
              type="monotone"
              dataKey={_.key}
              fill={_.color ?? colors(theme)[i] ?? colors(theme)[0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
