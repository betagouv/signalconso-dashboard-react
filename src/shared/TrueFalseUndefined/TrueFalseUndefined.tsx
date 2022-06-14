import {BoxProps, Theme, ToggleButton, ToggleButtonGroup} from '@mui/material'
import React, {forwardRef, ReactNode, useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {SxProps} from '@mui/system'

interface Props extends Omit<BoxProps, 'onChange'> {
  /**
   * Hack to work with react-hook-form since undefined value doesn't work as expected.
   * It is type inconsistent but do the job.
   */
  emitEmptyString?: boolean
  gutter?: boolean
  value?: boolean
  onChange: (_?: boolean) => void
  label?: {
    true?: ReactNode
    false?: ReactNode
    undefined?: ReactNode
  }
}

const buttonStyle: SxProps<Theme> = {
  textTransform: 'none',
  paddingRight: 1.5,
  paddingLeft: 1.5,
  whiteSpace: 'nowrap',
}

export const TrueFalseUndefined = forwardRef(({
  emitEmptyString,
  gutter,
  value,
  onChange,
  label,
  sx,
  ...props
}: Props, ref: any) => {
  const {m} = useI18n()
  const parsedValue = useMemo(() => {
    if ([true, 'true'].includes(value as any)) return 'true'
    if ([false, 'false'].includes(value as any)) return 'false'
    return ''
  }, [value])

  return (
    <ToggleButtonGroup
      {...props}
      exclusive
      sx={{
        ...(gutter
          ? {
              mt: 1,
              mb: 0.5,
              display: 'block',
            }
          : {}),
        ...sx,
      }}
      size="small"
      color="primary"
      ref={ref}
      style={{flexDirection: 'row'}}
      value={parsedValue}
      onChange={(e, value: string | null) => {
        if (value !== null) {
          const valueAsBoolean = {true: true, false: false}[value]
          // @ts-ignore
          onChange(emitEmptyString && valueAsBoolean === undefined ? '' : valueAsBoolean)
        }
      }}
    >
      <ToggleButton sx={buttonStyle} value="true">
        {label?.true ?? m.yes}
      </ToggleButton>
      <ToggleButton sx={buttonStyle} value="false">
        {label?.false ?? m.no}
      </ToggleButton>
      <ToggleButton sx={buttonStyle} value="">
        {label?.undefined ?? m.indifferent}
      </ToggleButton>
    </ToggleButtonGroup>
  )
})
