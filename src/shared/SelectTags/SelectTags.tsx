import { Icon, InputAdornment, TextField } from '@mui/material'
import * as React from 'react'
import { CSSProperties, forwardRef, useEffect } from 'react'
import { useMemoFn } from '../../alexlibs/react-hooks-lib'
import { SelectTagsMenu, SelectTagsMenuValues } from './SelectTagsMenu'

interface SelectDepartmentsProps {
  value?: SelectTagsMenuValues
  onChange?: (_: SelectTagsMenuValues) => void
  placeholder?: string
  style?: CSSProperties
  readonly?: boolean
  className?: string
  fullWidth?: boolean
  disabled?: boolean
  label?: string
}

export const SelectTags = forwardRef(
  (
    {
      value,
      readonly,
      onChange,
      label,
      disabled,
      ...props
    }: SelectDepartmentsProps,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    let $input: HTMLElement | undefined = undefined

    useEffect(() => {
      // indexValues.reset(value)
    }, [value])

    const open = (event: any) => {
      if (!disabled) setAnchorEl(event.currentTarget)
    }

    const close = () => {
      setAnchorEl(null)
    }

    const displayedValue = useMemoFn(value, (v) => {
      const included = Object.values(v).filter((_) => _ === 'included').length
      const excluded = Object.values(v).filter((_) => _ === 'excluded').length
      return (
        (included > 0 ? `+ (${included})  ` : ``) +
        (excluded > 0 ? ` - (${excluded})` : ``)
      )
    })

    return (
      <>
        <TextField
          {...props}
          ref={ref}
          variant="outlined"
          margin="dense"
          size="small"
          onClick={open}
          value={displayedValue}
          disabled={readonly}
          label={label}
          inputRef={(n: any) => ($input = n ?? undefined)}
          InputProps={{
            disabled,
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <Icon
                  sx={{
                    height: 20,
                    color: (t) => t.palette.text.secondary,
                    verticalAlign: 'top',
                  }}
                >
                  arrow_drop_down
                </Icon>
              </InputAdornment>
            ),
          }}
        />
        <SelectTagsMenu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={close}
          onChange={(x) => {
            onChange?.(x)
          }}
          value={value}
        />
      </>
    )
  },
)
