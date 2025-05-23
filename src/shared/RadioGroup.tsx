import { Box, FormHelperText } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'
import React, { ReactElement, ReactNode, Ref, useEffect, useState } from 'react'
import { ScRadioGroupItemProps } from './RadioGroupItem'

interface BaseProps<T> {
  dense?: boolean
  inline?: boolean
  children: React.ReactNode //ReactElement<ScRadioGroupItemProps>[]
  error?: boolean
  className?: string
  sx?: SxProps<Theme>
  helperText?: ReactNode
  disabled?: boolean
}

interface SingleProps<T> extends BaseProps<T> {
  defaultValue?: T
  value?: T
  onChange?: (_: T) => void
  multiple?: false
}

interface MultipleProps<T> extends BaseProps<T> {
  defaultValue?: T[]
  value?: T[]
  onChange?: (_: T[]) => void
  multiple: true
}

type Props<T> = SingleProps<T> | MultipleProps<T>

const isMultiple = <T,>(
  multiple: boolean | undefined,
  t: T | T[],
): t is T[] => {
  return !!multiple
}

const InnerScRadioGroup = <T,>(
  {
    inline,
    disabled,
    error,
    children,
    dense,
    value,
    onChange,
    multiple,
    helperText,
    defaultValue,
    sx,
    ...props
  }: Props<T>,
  ref: Ref<unknown>,
) => {
  const [innerValue, setInnerValue] = useState<T | T[]>()

  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value)
    } else if (multiple) {
      setInnerValue([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <Box
      ref={ref}
      {...props}
      role="radiogroup"
      sx={{
        ...(inline && {
          display: 'flex',
        }),
        ...sx,
      }}
    >
      {React.Children.map(
        children as ReactElement<ScRadioGroupItemProps<T>>[],
        (child, i) =>
          child &&
          React.cloneElement(child, {
            ...child.props,
            key: child.key ?? i,
            dense,
            error,
            disabled,
            multiple,
            inline,
            selected:
              innerValue && isMultiple(multiple, innerValue)
                ? innerValue.includes(child.props.value)
                : innerValue === child.props.value,
            onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              if (child.props.onClick) child.props.onClick(event)
              if (!disabled) {
                const value = child.props.value
                setInnerValue((currentValue) => {
                  const newValue = (() => {
                    if (isMultiple(multiple, currentValue)) {
                      if (currentValue.includes(value)) {
                        return currentValue.filter((_) => _ !== value)
                      } else {
                        return [...currentValue, value]
                      }
                    }
                    return value
                  })()
                  if (onChange) onChange(newValue as any)
                  return newValue
                })
              }
            },
          }),
      )}
      {helperText && (
        <FormHelperText error={error} sx={{ marginLeft: '14px' }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  )
}

/**
 * Workaround because forwardRef break the generic type of ScSelect.
 */
export const ScRadioGroup = React.forwardRef(InnerScRadioGroup as any) as <T>(
  props: Props<T> & { ref?: React.ForwardedRef<any> },
) => ReturnType<typeof InnerScRadioGroup>
