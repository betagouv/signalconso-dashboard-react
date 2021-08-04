import {format} from 'date-fns'
import React, {CSSProperties, useState} from 'react'
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

const onChangeDate = (callback: (date: Date) => any) => (e: React.ChangeEvent<HTMLInputElement>) => {
  callback(e.target.valueAsDate!)
}

const mapDate = (date: Date): string => format(date, 'yyyy-MM-dd')

export const PeriodPicker = ({value, onChange, label, fullWidth, className, style}: DatepickerProps) => {
  const [start, setStart] = useState<Date | undefined>(undefined)
  const [end, setEnd] = useState<Date | undefined>(undefined)
  const {m} = useI18n()
  const css = useStyles()
  const cssUtils = useCssUtils()

  const handleChange = () => {
    onChange([start, end])
  }

  return (
    <div className={classes(css.root, className, fullWidth && cssUtils.fullWidth)}>
      <Datepicker label={label?.[0] ?? m.start} fullWidth={fullWidth} value={start} onChange={handleChange} className={css.start} InputProps={{className: css.startInput}}/>
      <Datepicker label={label?.[1] ?? m.end} fullWidth={fullWidth} value={end} onChange={handleChange} InputProps={{className: css.endInput}}/>
    </div>
  )
}
