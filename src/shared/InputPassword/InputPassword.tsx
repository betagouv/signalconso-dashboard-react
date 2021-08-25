import {ScInput, ScInputProps} from '../Input/ScInput'
import {Icon, InputAdornment} from '@material-ui/core'
import React, {forwardRef, useState} from 'react'

interface ScInputPasswordProps extends Omit<ScInputProps, 'type'> {
}

export const ScInputPassword = forwardRef((props: ScInputPasswordProps, ref: any) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  return (
    <ScInput
      {...props}
      inputRef={ref}
      type={passwordVisible ? 'text' : 'password'}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end" onClick={() => setPasswordVisible(_ => !_)}>
            <Icon color="action">{passwordVisible ? 'visibility_off' : 'visibility'}</Icon>
          </InputAdornment>
        ),
      }}/>
  )
})
