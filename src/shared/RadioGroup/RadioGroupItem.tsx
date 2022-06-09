import {alpha, Box, BoxProps, Radio} from '@mui/material'
import React, {ReactNode} from 'react'
import {Txt} from 'mui-extension/lib/Txt/Txt'

export interface ScRadioGroupItemProps extends Omit<BoxProps, 'title'> {
  title?: string | ReactNode
  description?: string | ReactNode
  value: string
  selected?: boolean
  dense?: boolean
  inline?: boolean
  error?: boolean
}

export const ScRadioGroupItem = ({
  title,
  description,
  error,
  dense,
  inline,
  value,
  children,
  selected,
  onClick,
  sx,
  ...props
}: ScRadioGroupItemProps) => {
  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        // alignItems: 'center',
        alignItems: 'flex-start',
        border: t => '1px solid ' + t.palette.divider,
        borderBottomColor: 'transparent',
        py: 1.5,
        pr: 2,
        pl: 1,
        transition: 'all .2s ease-in-out',
        cursor: 'pointer',
        '&:last-of-type': {
          borderBottom: t => '1px solid ' + t.palette.divider,
          borderBottomRightRadius: t => t.shape.borderRadius + 'px',
          borderBottomLeftRadius: t => t.shape.borderRadius + 'px',
        },
        '&:first-of-type': {
          borderTopRightRadius: t => t.shape.borderRadius + 'px',
          borderTopLeftRadius: t => t.shape.borderRadius + 'px',
        },
        '&:hover': {
          zIndex: 1,
          border: t => `1px solid ${t.palette.primary.main}`,
          background: 'rgba(0,0,0,.04)',
        },
        ...(inline && /*css.rootInline,*/ {
          borderRightColor: 'transparent',
          '&:last-of-type': {
            borderRight: t => '1px solid ' + t.palette.divider,
            borderTopRightRadius: t => t.shape.borderRadius,
            borderBottom: t => '1px solid ' + t.palette.divider,
            borderBottomRightRadius: t => t.shape.borderRadius + 'px',
            borderBottomLeftRadius: '0px',
          },
          '&:first-of-type': {
            borderBottom: t => '1px solid ' + t.palette.divider,
            borderBottomRightRadius: '0px',
            borderBottomLeftRadius: t => t.shape.borderRadius + 'px',
            borderTopRightRadius: '0px',
          },
          '&:not(:first-of-type)': {
            marginLeft: '-1px',
            borderBottom: t => '1px solid ' + t.palette.divider,
          },
        }),
        ...(dense && /*css.rootDense,*/ {
          pt: 1 / 4,
          pb: 1 / 4,
        }),
        ...(selected && /*css.rootSelected,*/ {
          zIndex: 1,
          border: t => `1px solid ${t.palette.primary.main} !important`,
          background: t => alpha(t.palette.primary.main, 0.1),
          boxShadow: t => `inset 0 0 0 1px ${t.palette.primary.main}`,
        }),
        ...(error && /*css.rootError,*/ {
          borderColor: t => t.palette.error.main + ' !important',
        }),
        ...sx,
      }}
      onClick={onClick}
    >
      <Radio checked={selected} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: 42,
          flexDirection: 'column',
          ml: 1,
        }}
      >
        {title && (
          <Txt block size="big">
            {title}
          </Txt>
        )}
        {description && (
          <Txt block color="hint">
            {description}
          </Txt>
        )}
        {children && children}
      </Box>
    </Box>
  )
}
