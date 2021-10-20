import {addDays, subDays} from 'date-fns'
import React, {CSSProperties, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {makeStyles, Theme} from '@material-ui/core'
import {Datepicker} from '../Datepicker/Datepicker'
import {classes} from '../../core/helper/utils'
import {useCssUtils} from '../../core/helper/useCssUtils'

export interface DatepickerProps {
  value?: [Date | undefined, Date | undefined]
  onChange: (_: [Date | undefined, Date | undefined]) => void
  label?: [string, string]
  className?: string
  style?: CSSProperties
  fullWidth?: boolean
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  start: {
    marginRight: -1,
  },
  startInput: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  endInput: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
}))

export const PeriodPicker = ({value, onChange, label, fullWidth, className, style}: DatepickerProps) => {
  const [start, setStart] = useState<Date | undefined>(undefined)
  const [end, setEnd] = useState<Date | undefined>(undefined)
  const {m} = useI18n()
  const css = useStyles()
  const cssUtils = useCssUtils()
  
  useEffect(() => {
    if (value) {
      if (value[0] && value[0].getTime() !== start?.getTime()) setStart(value[0])
      if (value[1] && value[1].getTime() !== end?.getTime()) setEnd(value[1])
    }
  }, [value])

  const handleStartChange = (newStart?: Date) => {
    const newEnd = end && newStart ? (newStart.getTime() > end.getTime() ? addDays(newStart, 1) : end) : undefined
    setStart(newStart)
    setEnd(newEnd)
    onChange([newStart, newEnd])
  }
  const handleEndChange = (newEnd?: Date) => {
    const newStart = start && newEnd ? (newEnd.getTime() < start.getTime() ? subDays(newEnd, 1) : start) : undefined
    setStart(newStart)
    setEnd(newEnd)
    onChange([newStart, newEnd])
  }

  return (
    <div className={classes(css.root, className, fullWidth && cssUtils.fullWidth)} style={style}>
      <Datepicker
        label={label?.[0] ?? m.start}
        fullWidth={fullWidth}
        value={start}
        onChange={handleStartChange}
        className={css.start}
        InputProps={{className: css.startInput}}
      />

      <Datepicker
        label={label?.[1] ?? m.end}
        fullWidth={fullWidth}
        value={end}
        onChange={handleEndChange}
        InputProps={{className: css.endInput}}
      />
    </div>
  )
}
