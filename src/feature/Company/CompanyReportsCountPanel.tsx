import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {alpha, Button, ButtonGroup, makeStyles, Theme, useTheme} from '@material-ui/core'
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import * as React from 'react'
import {useI18n} from '../../core/i18n'
import {classes} from '../../core/helper/utils'
import {CountByDate, Period} from '../../core/api/client/company-stats/CompanyStats'
import {useMemoFn} from '../../shared/hooks/UseMemoFn'
import {format} from 'date-fns'

interface Props {
  data?: CountByDate[],
  period?: Period,
  onChange: (_: Period) => Promise<CountByDate[]>
}

const useStyles = makeStyles((t: Theme) => ({
  btnPeriodActive: {
    background: alpha(t.palette.primary.main, .14),
  },
}))

const periods: Period[] = ['day', 'month']

export const CompanyReportsCountPanel = ({data, period, onChange}: Props) => {
  const {m} = useI18n()
  const css = useStyles()
  const theme = useTheme()

  const mappedData = useMemoFn(data, _ => _.map(x => ({
    ...x,
    date: format(x.date, period === 'day' ? 'dd/MM/yyyy' : 'MM/yyyy'),
  })))

  return (
    <Panel loading={!data}>
      <PanelHead action={
        <ButtonGroup color="primary">
          {periods.map(p =>
            <Button
              key={p}
              className={classes(p === period && css.btnPeriodActive)}
              onClick={() => onChange(p)}
            >
              {m[p]}
            </Button>,
          )}
        </ButtonGroup>
      }>
        {m.reports}
      </PanelHead>

      <PanelBody style={{height: 300}}>
        {mappedData && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={mappedData}
            >
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="date"/>
              <YAxis/>
              <Tooltip/>
              <Legend wrapperStyle={{position: 'relative', marginTop: -16}}/>
              <Line name={m.reportsCount} type="monotone" dataKey="count" stroke={theme.palette.primary.main} strokeWidth={2}/>
              <Line name={m.responsesCount} type="monotone" dataKey="countResponded" stroke="#e48c00" strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        )}
      </PanelBody>
    </Panel>
  )
}
