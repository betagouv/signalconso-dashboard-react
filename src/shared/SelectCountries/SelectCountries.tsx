import {Icon, IconButton, TextField} from '@mui/material'
import {AutocompleteProps} from '@mui/material/Autocomplete'
import * as React from 'react'
import {forwardRef, useEffect, useState} from 'react'
import {stopPropagation} from '../../core/helper'
import {SelectCountriesMenu} from './SelectCountriesMenu'

interface Props
  extends Pick<AutocompleteProps<string, true, false, false>, 'value' | 'defaultValue' | 'className' | 'disabled' | 'fullWidth'> {
  label?: string
  onChange: (_: string[]) => void
}

export const SelectCountries = forwardRef(({value, onChange, disabled, ...props}: Props, ref: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [innerValue, setInnerValue] = useState<string[]>([])

  useEffect(() => {
    if (value) setInnerValue(Array.isArray(value) ? value : [value])
  }, [])

  const open = (event: any) => {
    if (!disabled) setAnchorEl(event.currentTarget)
  }

  const close = () => setAnchorEl(null)

  const innerOnChange = (countries: string[]) => {
    onChange(countries)
    setInnerValue(countries)
  }

  const clear = () => {
    innerOnChange([])
  }

  return (
    <>
      <TextField
        {...props}
        size="small"
        margin="dense"
        variant="outlined"
        inputRef={ref}
        onClick={open}
        maxRows={2}
        rows={2}
        value={innerValue.join(', ')}
        InputProps={{
          disabled,
          style: {paddingRight: 4},
          endAdornment: (
            <>
              <IconButton
                size="small"
                onClick={_ => stopPropagation(clear)(_)}
                sx={{
                  ...(innerValue.length === 0 && {visibility: 'hidden'}),
                }}
              >
                <Icon>clear</Icon>
              </IconButton>
            </>
          ),
        }}
        inputProps={{
          autoComplete: 'new-password', // disable autocomplete and autofill
        }}
      />
      <SelectCountriesMenu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={close}
        onChange={innerOnChange}
        initialValues={innerValue}
      />
    </>
  )
})
