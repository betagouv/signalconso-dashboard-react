import * as React from 'react'
import {forwardRef, useEffect, useState} from 'react'
import {createStyles, Icon, IconButton, makeStyles, TextField, Theme} from '@material-ui/core'
import {AutocompleteProps} from '@material-ui/lab'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {useI18n} from '../../core/i18n'
import {classes, stopPropagation} from '../../core/helper/utils'
import {SelectCountriesMenu} from './SelectCountriesMenu'

const useStyles = makeStyles((t: Theme) => {
  return createStyles({
    adornment: {
      height: 20,
      color: t.palette.text.secondary,
      verticalAlign: 'top',
    },
    endAdornment: {
      display: 'flex',
      alignItems: 'center',
    }
  })
})

interface Props extends Pick<AutocompleteProps<string, true, false, false>,
  | 'value'
  | 'defaultValue'
  | 'className'
  // | 'ref'
  | 'placeholder'
  | 'fullWidth'> {
  onChange: (_: string[]) => void
}

export const SelectCountries = forwardRef(({value, onChange, ...props}: Props, ref: any) => {
  const cssUtils = useCssUtils()
  const css = useStyles()
  const {m} = useI18n()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [innerValue, setInnerValue] = useState<string[]>([])

  useEffect(() => {
    if (value) setInnerValue(Array.isArray(value) ? value : [value])
  }, [])

  const open = (event: any) => setAnchorEl(event.currentTarget)

  const close = () => setAnchorEl(null)

  const innerOnChange = (countries: string[]) => {
    onChange(countries)
    setInnerValue(countries)
  }

  const clear = () => {
    innerOnChange([])
  }

  // // const handleInputChange = (event: any) => {
  //   setInputValue(event.target.value)
  //   if (inputValue !== '') open(event)
  // }

  return (
    <>
      <TextField
        {...props}
        size="small"
        margin="dense"
        variant="outlined"
        inputRef={ref}
        onClick={open}
        rowsMax={2}
        rows={2}
        value={innerValue.join(', ')}
        // value={inputValue}
        InputProps={{
          style: {paddingRight: 4},
          // startAdornment: indexValues.toArray().map(_ =>
          //   <Chip size="small" label={_} style={{margin: 2}} onDelete={() => indexValues.delete(_)}/>
          // ),
          endAdornment: (
            <div className={css.endAdornment}>
              <IconButton size="small" onClick={_ => stopPropagation(clear)(_)} className={classes(innerValue.length === 0 && cssUtils.hidden)}>
                <Icon>clear</Icon>
              </IconButton>
              {/*<IconButton size="small" onClick={open}>*/}
              {/*  <Icon>arrow_drop_down</Icon>*/}
              {/*</IconButton>*/}
            </div>
          )
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
