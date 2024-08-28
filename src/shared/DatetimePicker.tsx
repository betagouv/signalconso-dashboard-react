import {
  InputProps as StandardInputProps,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { format } from 'date-fns-tz'
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

export const Datetimepicker = ({
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
        onChange(new Date(newValue))
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
      const newValue = format(value, 'yyyy-MM-dd HH:mm:ss').replace(' ', 'T')
      setDisplayedDate(newValue)
    } else {
      setDisplayedDate('')
    }
  }, [value])

  return (
    <TextField
      {...props}
      type="datetime-local"
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
