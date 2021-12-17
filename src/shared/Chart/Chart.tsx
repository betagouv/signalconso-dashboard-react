import {Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import * as React from 'react'
import {useMemo} from 'react'
import {Theme, useTheme} from '@mui/material'

interface Props {
  height?: number
  curves: {
    label: string
    key: string
    curve: {date: string; count: number}[]
    color?: string
  }[]
}

const colors = (t: Theme) => [t.palette.primary.main, '#e48c00', 'red', 'green']

export const ScLineChart = ({curves, height}: Props) => {
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
        <LineChart width={500} height={300} data={mappedData}>
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
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
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
