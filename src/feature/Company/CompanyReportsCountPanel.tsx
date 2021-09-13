import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {alpha, Button, ButtonGroup, makeStyles, Theme, useTheme} from '@material-ui/core'
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import * as React from 'react'
import {useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {classes} from '../../core/helper/utils'
import {ReportsCountEvolution, ReportsCountEvolutionPeriod} from '../../core/api/client/company-stats/CompanyStats'

interface Props {
  data?: ReportsCountEvolution,
  period?: ReportsCountEvolutionPeriod,
  onChange: (_: ReportsCountEvolutionPeriod) => Promise<ReportsCountEvolution>
}

const useStyles = makeStyles((t: Theme) => ({
  btnPeriodActive: {
    background: alpha(t.palette.primary.main, .14),
  },
}))

export const CompanyReportsCountPanel = ({data, period, onChange}: Props) => {
  const {m} = useI18n()
  const css = useStyles()
  const theme = useTheme()
  const {formatDate} = useI18n()

  const mappedData = useMemo(() => {
    return data?.map(([date, count]) => ({date: formatDate(date), [m.reportsCount]: count}))
  }, [data])

  return (
    <Panel loading={!data}>
      <PanelHead action={
        <ButtonGroup color="primary">
          <Button
            className={classes(period === 'day' && css.btnPeriodActive)}
            onClick={() => onChange('day')}
          >
            {m.day}
          </Button>
          <Button
            className={classes(period === 'week' && css.btnPeriodActive)}
            onClick={() => onChange('week')}
          >
            {m.week}
          </Button>
          <Button
            className={classes(period === 'month' && css.btnPeriodActive)}
            onClick={() => onChange('month')}
          >
            {m.month}
          </Button>
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
              <Legend/>
              <Line type="monotone" dataKey={m.reportsCount} stroke={theme.palette.primary.main} strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        )}
      </PanelBody>
    </Panel>
  )
}
