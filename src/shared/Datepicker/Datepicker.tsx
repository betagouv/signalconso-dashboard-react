import {format} from 'date-fns'
import {zonedTimeToUtc} from 'date-fns-tz'
import {InputProps as StandardInputProps, TextField, TextFieldProps} from '@mui/material'
import React from 'react'

export interface DatepickerProps extends Omit<TextFieldProps, 'onChange'> {
  value?: Date
  onChange: (_: Date) => void
  label?: string
  InputProps?: Partial<StandardInputProps>
  fullWidth?: boolean
  timeOfDay: // when picking a date, the Date returned will be at 00:00:000 in the user timezone
  | 'startOfDay'
    // with this, it will be at 23:59:999 in the user timezone
    | 'endOfDay'
}

export const Datepicker = ({value, onChange, label, fullWidth, InputProps, timeOfDay, ...props}: DatepickerProps) => {
  console.log('@@@ Datepicker render', label, value)
  // unit tests would be good on that function
  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    // The datepicker gives us a date at 00:00:00 in UTC, but that's not what we want
    // We want to extract the year/month/date information and build our date ourselves
    const midnightUtcDate = e.target.valueAsDate!
    const yyyymmdd = [
      midnightUtcDate.getUTCFullYear(),
      (midnightUtcDate.getUTCMonth() + 1).toString().padStart(2, '0'),
      midnightUtcDate.getUTCDate().toString().padStart(2, '0'),
    ].join('-')
    const dateAndTime = timeOfDay ? `${yyyymmdd} 00:00:000` : `${yyyymmdd} 23:59:999`
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const utcDate = zonedTimeToUtc(dateAndTime, userTimeZone)
    onChange(utcDate)
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
