import { Box, Button, CircularProgress, Icon } from '@mui/material'
import { ButtonProps } from '@mui/material/Button'
import * as React from 'react'
import { forwardRef } from 'react'
import { makeSx } from './common'

const sx = makeSx({
  icon: {
    lineHeight: '22px !important',
    fontSize: '22px !important',
    marginRight: 1,
  },
})

export interface BtnProps extends ButtonProps {
  loading?: boolean
  icon?: string
  iconAfter?: string
}

export const Btn = forwardRef(
  (
    { loading, children, disabled, icon, iconAfter, ...props }: BtnProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    return (
      <Button {...props} disabled={disabled || loading} ref={ref}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ...(loading && {
              visibility: 'hidden',
            }),
          }}
        >
          {icon && (
            <Icon fontSize={props.size} sx={sx.icon}>
              {icon}
            </Icon>
          )}
          {children}
          {iconAfter && (
            <Icon
              fontSize={props.size}
              sx={{
                ...sx.icon,
                mr: 0,
                ml: 1,
              }}
            >
              {iconAfter}
            </Icon>
          )}
        </Box>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              mt: -1.5,
              ml: -1.5,
            }}
          />
        )}
      </Button>
    )
  },
)
