import {format} from 'date-fns'
import {InputProps as StandardInputProps, TextField, TextFieldProps} from '@mui/material'
import React from 'react'

export interface DatepickerProps extends Omit<TextFieldProps, 'onChange'> {
  value?: Date
  onChange: (_: Date) => void
  label?: string
  InputProps?: Partial<StandardInputProps>
  fullWidth?: boolean
  time: 
    // when picking a date, the Date returned will be at 00:00:000 in the user timezone
    'startOfDay' |
    // with this, it will be at 23:59:999 in the user timezone
    'endOfDay'
}

export const Datepicker = ({value, onChange, label, fullWidth, InputProps, ...props}: DatepickerProps) => {

  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const midnightUtcDate = e.target.valueAsDate!

    // TODO alter the date based on "time" prop

    onChange(midnightUtcDate)
  }

  return (
    <TextField
      {...props}
      type="date"
      margin="dense"
      variant="outlined"
      size="small"
      label={label}
      InputProps={InputProps}
      value={value}
      onChange={onChangeDate}
      fullWidth={fullWidth}
      InputLabelProps={{shrink: true}}
    />
  )
}
