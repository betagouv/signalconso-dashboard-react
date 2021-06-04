import {TextFieldProps} from '@material-ui/core/TextField/TextField'
import React from 'react'
import {TextField} from '@material-ui/core'
import {InputProps as StandardInputProps} from '@material-ui/core/Input/Input'

export type InputProps = Omit<TextFieldProps, 'variant' | 'margin'> & {
  small?: boolean
  InputProps?: Partial<StandardInputProps>
}

export const ScInput = React.forwardRef(({small, ...props}: InputProps, ref) => {
  return (
    <TextField
      {...props}
      size="small"
      variant="outlined"
      margin="dense"
      inputRef={ref}
      InputProps={{
        style: small ? {
          height: 32
        } : {}
      }}
    />
  )
})
