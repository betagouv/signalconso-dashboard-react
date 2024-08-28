import {
  InputProps as StandardInputProps,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { zonedTimeToUtc } from 'date-fns-tz'
import React, { useEffect, useState } from 'react'

interface DatepickerProps extends Omit<TextFieldProps, 'onChange'> {
  value?: Date
  onChange: (_: Date | undefined) => void
  label?: string
  InputProps?: Partial<StandardInputProps>
  fullWidth?: boolean
  timeOfDay: // when picking a date, the Date returned will be at 00:00:000 in the user timezone
  | 'startOfDay'
    // with this, it will be at 23:59:999 in the user timezone
    | 'endOfDay'
}

export const Datepicker = ({
  value,
  onChange,
  label,
  fullWidth,
  InputProps,
  timeOfDay,
  ...props
}: DatepickerProps) => {
  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsIsValidDate(e.target.value === '' || e.target.checkValidity())
    if (e.target.checkValidity()) {
      const newValue = e.target.value
      // it is either an empty string or yyyy-mm-dd
      if (newValue.length) {
        const dateAndTime = `${newValue}T${timeOfDay === 'startOfDay' ? '00:00:00.000' : '23:59:59.999'}`
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const utcDate = zonedTimeToUtc(dateAndTime, userTimeZone)
        onChange(utcDate)
      } else {
        onChange(undefined)
      }
    }
    setDisplayedDate(e.target.value)
  }

  const [displayedDate, setDisplayedDate] = useState<string>('')
  const [isValidDate, setIsIsValidDate] = useState<boolean>(true)

  useEffect(() => {
    setIsIsValidDate(true)
    if (value) {
      const yyyymmdd = [
        value.getFullYear(),
        (value.getMonth() + 1).toString().padStart(2, '0'),
        value.getDate().toString().padStart(2, '0'),
      ].join('-')
      setDisplayedDate(yyyymmdd)
    } else {
      setDisplayedDate('')
    }
  }, [value])

  return (
    <TextField
      {...props}
      type="date"
      margin="dense"
      variant="outlined"
      size="small"
      label={label}
      InputProps={InputProps}
      value={displayedDate}
      onChange={onChangeDate}
      fullWidth={fullWidth}
      InputLabelProps={{ shrink: true }}
      error={!isValidDate}
    />
  )
}
