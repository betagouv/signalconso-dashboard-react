import {format} from 'date-fns'
import {TextField} from '@material-ui/core'
import React, {CSSProperties} from 'react'
import {InputProps as StandardInputProps} from '@material-ui/core/Input/Input'

export interface DatepickerProps {
  value?: Date
  onChange: (_: Date) => void
  label?: string
  className?: string
  InputProps?: Partial<StandardInputProps>;
  style?: CSSProperties
  fullWidth?: boolean
}

const onChangeDate = (callback: (date: Date) => any) => (e: React.ChangeEvent<HTMLInputElement>) => {
  callback(e.target.valueAsDate!)
}

const mapDate = (date: Date): string => format(date, 'yyyy-MM-dd')

export const Datepicker = ({value, onChange, label, fullWidth, InputProps, className, style}: DatepickerProps) => {
  return (
    <TextField
      type="date"
      margin="dense"
      variant="outlined"
      className={className}
      style={style}
      label={label}
      InputProps={InputProps}
      value={value ? mapDate(value) : ''}
      onChange={onChangeDate(onChange)}
      fullWidth={fullWidth}
      InputLabelProps={{ shrink: true }}
    />
  )
}
