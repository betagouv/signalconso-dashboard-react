import {format} from 'date-fns'
import {TextField} from '@material-ui/core'
import React from 'react'

export interface DatepickerProps {
  value?: Date
  onChange: (_: Date) => void
  label?: string
}

const onChangeDate = (callback: (date: Date) => any) => (e: React.ChangeEvent<HTMLInputElement>) => {
  callback(e.target.valueAsDate!)
}

const mapDate = (date: Date): string => format(date, 'yyyy-MM-dd')

export const Datepicker = ({value, onChange, label}: DatepickerProps) => {
  return (
    <TextField
      type="date"
      margin="dense"
      variant="outlined"
      label={label}
      value={value ? mapDate(value) : undefined}
      onChange={onChangeDate(onChange)}
    />
  )
}
