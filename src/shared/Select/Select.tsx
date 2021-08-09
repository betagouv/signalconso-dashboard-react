import React, {CSSProperties, useMemo} from 'react'
import {FormControl, InputLabel, Select} from '@material-ui/core'
import {SelectProps} from '@material-ui/core/Select/Select'

interface ScSelectProps extends SelectProps {
  label?: string
  children?: React.ReactNode
  className?: string
  style?: CSSProperties
  small?: boolean
}

export const ScSelect = React.forwardRef(({label, className, style, small, fullWidth, ...selectProps}: ScSelectProps, ref) => {
  const id = useMemo(() => 'sc-select-' + Math.floor(Math.random() * 10000), [])
  return (
    <FormControl fullWidth={fullWidth} size="small" margin="dense" variant="outlined" className={className} style={style}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select {...selectProps} inputRef={ref} labelId={id} />
    </FormControl>
  )
})
