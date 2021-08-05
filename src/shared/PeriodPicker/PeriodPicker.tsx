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
      setStart(value[0])
      setEnd(value[1])
    }
  }, [value])

  const handleStartChange = (newStart: Date) => {
    setStart(newStart)
    if (end && newStart.getTime() > end.getTime()) {
      setEnd(addDays(newStart, 1))
    }
    onChange([start, end])
  }
  const handleEndChange = (newEnd: Date) => {
    setEnd(newEnd)
    if (start && newEnd.getTime() < start.getTime()) {
      setStart(subDays(newEnd, 1))
    }
    onChange([start, end])
  }

  return (
    <div className={classes(css.root, className, fullWidth && cssUtils.fullWidth)}>
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
