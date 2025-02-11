import { FormControl, InputLabel, Select, SelectProps } from '@mui/material'
import React, { CSSProperties, Ref, useMemo } from 'react'

type ScSelectProps<T> = SelectProps<T> & {
  label?: string
  children?: React.ReactNode
  className?: string
  style?: CSSProperties
  small?: boolean
}

const InnerScSelect = <T,>(
  {
    id: argId,
    label,
    className,
    small,
    fullWidth,
    style,
    ...selectProps
  }: ScSelectProps<T>,
  ref: Ref<unknown>,
) => {
  const id: string = useMemo(
    () => argId ?? 'sc-select-' + Math.floor(Math.random() * 10000),
    [argId],
  )
  return (
    <FormControl
      fullWidth={fullWidth}
      size="small"
      margin="dense"
      variant="outlined"
      className={className}
      style={style}
    >
      <InputLabel htmlFor={id} id={id + '-label'}>
        {label}
      </InputLabel>
      <Select
        {...selectProps}
        inputRef={ref}
        label={label}
        labelId={id + '-label'}
        id={id}
      />
    </FormControl>
  )
}

/**
 * Workaround because forwardRef break the generic type of ScSelect.
 */
export const ScSelect = React.forwardRef(InnerScSelect) as <T>(
  props: ScSelectProps<T> & { ref?: React.ForwardedRef<any> },
) => ReturnType<typeof InnerScSelect>
