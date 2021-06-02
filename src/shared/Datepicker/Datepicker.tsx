import {format} from 'date-fns'
import {TextField} from '@material-ui/core'
import React, {CSSProperties} from 'react'

export interface DatepickerProps {
  value?: Date
  onChange: (_: Date) => void
  label?: string
  className?: string
  style?: CSSProperties
  fullWidth?: boolean
}

const onChangeDate = (callback: (date: Date) => any) => (e: React.ChangeEvent<HTMLInputElement>) => {
  callback(e.target.valueAsDate!)
}

const mapDate = (date: Date): string => format(date, 'yyyy-MM-dd')

export const Datepicker = ({value, onChange, label, fullWidth, className, style}: DatepickerProps) => {
  return (
    <TextField
      type="date"
      margin="dense"
      variant="outlined"
      className={className}
      style={style}
      label={label}
      value={value ? mapDate(value) : undefined}
      onChange={onChangeDate(onChange)}
      fullWidth
      InputLabelProps={{ shrink: true }}
    />
  )
}
