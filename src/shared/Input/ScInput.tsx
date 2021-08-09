import {TextFieldProps} from '@material-ui/core/TextField/TextField'
import React from 'react'
import {TextField} from '@material-ui/core'
import {InputProps as StandardInputProps} from '@material-ui/core/Input/Input'
import {FilledInputProps} from '@material-ui/core/FilledInput'

export type ScInputProps = Omit<TextFieldProps, 'variant' | 'margin'> & {
  small?: boolean
  InputProps?: Partial<FilledInputProps>
}

export const ScInput = React.forwardRef(({small, ...props}: ScInputProps, ref) => {
  return (
    <TextField
      {...props}
      size="small"
      variant="outlined"
      margin="dense"
      inputRef={ref}
      InputProps={{
        ...props.InputProps,
        style: small
          ? {
              ...props.InputProps?.style,
              height: 32,
            }
          : props.InputProps?.style,
      }}
    />
  )
})
