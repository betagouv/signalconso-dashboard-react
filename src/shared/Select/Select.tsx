import React, {CSSProperties, useMemo} from 'react'
import {FormControl, InputLabel, Select} from '@mui/material'
import {SelectProps} from '@mui/material'

interface ScSelectProps extends SelectProps {
  label?: string
  children?: React.ReactNode
  className?: string
  style?: CSSProperties
  small?: boolean
}

export const ScSelect = React.forwardRef(
  ({id: argId, label, className, style, small, fullWidth, ...selectProps}: ScSelectProps, ref) => {
    const id: string = useMemo(() => argId ?? 'sc-select-' + Math.floor(Math.random() * 10000), [argId])
    return (
      <FormControl fullWidth={fullWidth} size="small" margin="dense" variant="outlined" className={className} style={style}>
        <InputLabel htmlFor={id} id={id + '-label'}>
          {label}
        </InputLabel>
        <Select {...selectProps} inputRef={ref} labelId={id + '-label'} id={id} />
      </FormControl>
    )
  },
)
