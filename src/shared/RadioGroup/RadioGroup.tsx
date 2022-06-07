import React, {forwardRef, ReactElement, useEffect, useState} from 'react'
import {ScRadioGroupItemProps} from './RadioGroupItem'
import {Box, SxProps, Theme} from '@mui/material'

interface Props {
  className?: string
  sx?: SxProps<Theme>
  dense?: boolean
  children: React.ReactNode //ReactElement<ScRadioGroupItemProps>[]
  value?: string
  inline?: boolean
  border?: boolean
  error?: boolean
  onChange?: (_: string) => void
}

export const ScRadioGroup = forwardRef(
  ({error, className, children, dense, value, inline, border, onChange, sx}: Props, ref: any) => {
    const [innerValue, setInnerValue] = useState<string>()

    useEffect(() => {
      setInnerValue(value)
    }, [])

    return (
      <Box sx={{...(inline && {display: 'flex'})}} className={className} ref={ref}>
        {React.Children.map(children as ReactElement<ScRadioGroupItemProps>[], child =>
          React.cloneElement(child, {
            ...child.props,
            dense,
            inline,
            error,
            selected: innerValue === child.props.value,
            onClick: (e: any) => {
              setInnerValue(child.props.value)
              if (child.props.onClick) child.props.onClick(e)
              if (onChange) onChange(child.props.value)
            },
          }),
        )}
      </Box>
    )
  },
)
