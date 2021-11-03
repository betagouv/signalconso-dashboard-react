import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {alpha, Button, ButtonGroup, Icon, IconButton, Theme, useTheme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import * as React from 'react'
import {useI18n} from '../../core/i18n'
import {classes} from '../../core/helper/utils'
import {CountByDate, Period} from '@signal-conso/signalconso-api-sdk-js'
import {useMemoFn} from '../../shared/hooks/UseMemoFn'
import {format} from 'date-fns'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {siteMap} from '../../core/siteMap'
import { NavLink } from 'react-router-dom'

interface Props {
  total?: number
  data?: CountByDate[]
  period?: Period
  onChange: (_: Period) => void
}

const useStyles = makeStyles((t: Theme) => ({
  btnPeriodActive: {
    background: alpha(t.palette.primary.main, 0.14),
  },
}))

const periods: Period[] = ['Day', 'Month']

export const CompanyReportsCountPanel = ({total, data, period, onChange}: Props) => {
  const {formatLargeNumber, m} = useI18n()
  const css = useStyles()
  const cssUtils = useCssUtils()
  const theme = useTheme()

  const mappedData = useMemoFn(data, _ =>
    _.map(x => ({
      ...x,
      date: format(x.date, period === 'Day' ? 'dd/MM/yyyy' : 'MM/yyyy'),
    })),
  )

  return (
    <Panel loading={!data}>
      <PanelHead
        action={
          <ButtonGroup color="primary">
            {periods.map(p => (
              <Button key={p} className={classes(p === period && css.btnPeriodActive)} onClick={() => onChange(p)}>
                {p === 'Day' ? m.day : m.month}
              </Button>
            ))}
          </ButtonGroup>
        }
      >
        {total && formatLargeNumber(total)}
        &nbsp;
        {m.reports.toLocaleLowerCase()}
        <NavLink to={siteMap.logged.reports()}>
          <IconButton size={'small'} className={classes(cssUtils.colorTxtHint, cssUtils.marginLeft)}>
            <Icon>open_in_new</Icon>
          </IconButton>
        </NavLink>
      </PanelHead>

      <PanelBody style={{height: 300}}>
        {mappedData && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart width={500} height={300} data={mappedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend wrapperStyle={{position: 'relative', marginTop: -16}} />
              <Line name={m.reportsCount} type="monotone" dataKey="count" stroke={theme.palette.primary.main} strokeWidth={2} />
              <Line name={m.responsesCount} type="monotone" dataKey="countResponded" stroke="#e48c00" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </PanelBody>
    </Panel>
  )
}
