import * as React from 'react'
import {ReactNode, useMemo, useState} from 'react'
import {alpha, Box, Theme, Tooltip} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import withStyles from '@mui/styles/withStyles'
import {useTimeout} from 'mui-extension/lib/core/utils/useTimeout'
import {mapFor} from '@alexandreannic/ts-utils/lib/common'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useI18n} from '../../core/i18n'

export interface HorizontalBarChartData {
  label: ReactNode
  value: number
  color?: string
}

interface Props {
  data?: HorizontalBarChartData[]
  grid?: boolean
  width?: number
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    overflow: 'hidden',
  },
  item: {
    display: 'flex',
    margin: t.spacing(0.5, 0, 0.5, 0),
  },
  label: {
    textAlign: 'right',
    padding: t.spacing(0, 2, 0, 0),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  barContainer: {
    padding: t.spacing(0.25, 0, 0.25, 0),
    flex: 1,
    transition: t.transitions.create('background'),
    '&:hover': {
      background: alpha(t.palette.primary.main, 0.1),
    },
  },
  bar: {
    transition: t.transitions.create('width', {duration: 1000}),
    width: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 26,
    backgroundColor: t.palette.primary.main,
  },
  bar_label: {
    color: t.palette.primary.contrastText,
    fontWeight: t.typography.fontWeightBold,
    marginRight: t.spacing(1),
  },
  legend: {
    position: 'relative',
    width: '100%',
  },
  legendTick: {
    width: 1,
    height: 1000,
    background: t.palette.divider,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  tooltipBody: {
    textAlign: 'right',
  },
}))

export const HorizontalBarChart = ({data, grid, width = 200}: Props) => {
  const css = useStyles()
  const {m} = useI18n()
  const maxValue = useMemo(() => data && Math.max(...data.map(_ => _.value)), [data])
  const sumValue = useMemo(() => data && data.reduce((sum, _) => _.value + sum, 0), [data])
  const [appeared, setAppeared] = useState<boolean>(false)
  const gridAxis = 4
  const {formatLargeNumber} = useI18n()
  useTimeout(() => setAppeared(true), 0)

  return (
    <div className={css.root}>
      {
        data && maxValue && sumValue ? (
        data.map((item, i) => {
          const percentOfMax = (item.value / maxValue) * 100
          const percentOfAll = (item.value / sumValue) * 100
          return (
            <div key={i} className={css.item}>
              <div className={css.label} style={ { width : width, minWidth : width}} >{item.label}</div>
              <LightTooltip
                title={
                  <>
                    <Txt size="big" block bold>
                      {item.label}
                    </Txt>
                    <div className={css.tooltipBody}>
                      <Txt size="title" color="primary" block>
                        {formatLargeNumber(item.value)}
                      </Txt>
                      <Txt size="big" color="hint" block>
                        {Math.ceil(percentOfAll)}%
                      </Txt>
                    </div>
                  </>
                }
              >
                <div className={css.barContainer}>
                  <div className={css.bar} style={{width: appeared ? `${percentOfMax}%` : 0, backgroundColor: item.color}}>
                    {percentOfMax > 40 && <div className={css.bar_label}>{formatLargeNumber(item.value)}</div>}
                  </div>
                </div>
              </LightTooltip>
            </div>
          )
        })
      ) : (
        <Box className={css.label}> {m.noDataAtm} </Box>
      )}
      {grid && data && data.length > 0 && (
        <div className={css.item}>
          <div className={css.label} style={ { width : width, minWidth : width}} />
          <div className={css.legend}>
            {mapFor(gridAxis + 1, i => (
              <div key={i} className={css.legendTick} style={{left: `calc(${i * (100 / gridAxis)}% - 1px)`}} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip)
