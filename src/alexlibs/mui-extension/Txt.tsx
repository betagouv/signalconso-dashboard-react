import { Box, BoxProps, Skeleton } from '@mui/material'
import { forwardRef, Ref } from 'react'
import { colorBlueFrance, colorsMui } from './color'

interface Props extends BoxProps {
  bold?: boolean
  italic?: boolean
  gutterTop?: boolean
  gutterBottom?: boolean
  block?: boolean
  skeleton?: boolean | number | string
  size?: 'big' | 'title' | 'small'
  color?: 'primary' | 'disabled' | 'hint' | 'error' | 'success' | 'warning'
  uppercase?: boolean
  truncate?: boolean
  noWrap?: boolean
  link?: boolean
}

export const Txt = forwardRef(
  (
    {
      skeleton,
      children,
      gutterBottom,
      gutterTop,
      block,
      bold,
      size,
      link,
      italic,
      color,
      uppercase,
      truncate,
      noWrap,
      sx,
      ...otherProps
    }: Props,
    ref: Ref<unknown>,
  ) => {
    return (
      <Box
        sx={{
          display: 'inline',
          lineHeight: '1.5',
          ...(size &&
            {
              title: {
                fontSize: '1.30rem',
              },
              big: {
                fontSize: '1.10rem',
              },
              small: {
                fontSize: '0.90rem',
              },
            }[size]),
          ...(color &&
            {
              primary: {
                color: colorBlueFrance,
              },
              disabled: {
                color: colorsMui.textDisabled,
              },
              hint: {
                color: colorsMui.textSecondary,
              },
              error: {
                color: colorsMui.errorMain,
              },
              success: {
                color: colorsMui.successMain,
              },
              warning: {
                color: colorsMui.warningMain,
              },
            }[color]),
          ...(block && {
            display: 'block',
          }),
          ...(bold && {
            fontWeight: (t) => t.typography.fontWeightMedium,
          }),
          ...(italic && {
            fontStyle: 'italic',
          }),
          ...(gutterTop && {
            mt: 1,
          }),
          ...(gutterBottom && {
            mb: 1,
          }),
          ...(link && {
            color: colorBlueFrance,
          }),
          ...(uppercase && {
            textTransform: 'uppercase' as any,
          }),
          ...(noWrap && {
            whiteSpace: 'nowrap' as any,
          }),
          ...(truncate && {
            whiteSpace: 'nowrap' as any,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }),
          ...sx,
        }}
        {...otherProps}
        ref={ref}
      >
        {skeleton ? (
          <Skeleton
            sx={{ display: 'inline-block' }}
            width={isNaN(skeleton as any) ? '80%' : (skeleton as number)}
          />
        ) : (
          children
        )}
      </Box>
    )
  },
)
