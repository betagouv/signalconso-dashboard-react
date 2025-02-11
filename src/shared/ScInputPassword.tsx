import { Icon, InputAdornment, TextField } from '@mui/material'
import { forwardRef, Ref, useState } from 'react'
import { ScInputProps } from './ScInput'

type ScInputPasswordProps = Omit<ScInputProps, 'type'>

export const ScInputPassword = forwardRef(
  (props: ScInputPasswordProps, ref: Ref<HTMLDivElement>) => {
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
    return (
      <TextField
        {...props}
        ref={ref}
        variant="filled"
        type={passwordVisible ? 'text' : 'password'}
        InputProps={{
          ...props.InputProps,
          endAdornment: (
            <InputAdornment
              className="cursor-pointer"
              position="end"
              onClick={() => setPasswordVisible((_) => !_)}
            >
              <Icon color="action">
                {passwordVisible ? 'visibility_off' : 'visibility'}
              </Icon>
            </InputAdornment>
          ),
        }}
      />
    )
  },
)
