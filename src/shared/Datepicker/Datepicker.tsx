import {format} from 'date-fns'
import {BoxProps, InputProps as StandardInputProps, TextField, TextFieldProps} from '@mui/material'
import React from 'react'

export interface DatepickerProps  extends Omit<TextFieldProps, 'onChange'> {
  value?: Date
  onChange: (_: Date) => void
  label?: string
  InputProps?: Partial<StandardInputProps>
  fullWidth?: boolean
}

const onChangeDate = (callback: (date: Date) => any) => (e: React.ChangeEvent<HTMLInputElement>) => {
  callback(e.target.valueAsDate!)
}

const mapDate = (date: Date): string => format(date, 'yyyy-MM-dd')

export const Datepicker = ({value, onChange, label, fullWidth, InputProps, ...props}: DatepickerProps) => {
  return (
    <TextField
      {...props}
      type="date"
      margin="dense"
      variant="outlined"
      size="small"
      label={label}
      InputProps={InputProps}
      value={value ? mapDate(value) : ''}
      onChange={onChangeDate(onChange)}
      fullWidth={fullWidth}
      InputLabelProps={{shrink: true}}
    />
  )
}
