import * as React from 'react'
import {useEffect, useMemo} from 'react'
import {useConstantContext} from '../../core/context/ConstantContext'
import {fromNullable} from 'fp-ts/lib/Option'
import {Country} from '../../core/api'
import {Checkbox, createStyles, fade, Icon, IconButton, makeStyles, Menu, TextField, Theme} from '@material-ui/core'
import {AutocompleteProps} from '@material-ui/lab'
import {useCssUtils} from '../../core/utils/useCssUtils'
import {useI18n} from '../../core/i18n'
import {classes, stopPropagation} from '../../core/helper/utils'
import {useSetState, UseSetState} from '@alexandreannic/react-hooks-lib/lib'

const withRegions = (WrappedComponent: React.ComponentType<Props>) => React.forwardRef((props: Omit<Props, 'countries'>, ref) => {
  const {countries} = useConstantContext()
  useEffect(() => {
    countries.fetch()()
  }, [])
  return fromNullable(countries.entity).map(_ => <WrappedComponent {...props} countries={_.filter(_ => _.code !== 'FR')} ref={ref}/>).getOrElse(<></>)
})

const useStyles = makeStyles((t: Theme) => {
  const iconWidth = 50
  return createStyles({
    adornment: {
      height: 20,
      color: t.palette.text.secondary,
      verticalAlign: 'top',
    },
    menuItem: {
      minHeight: 36,
      display: 'flex',
      alignItems: 'center',
      padding: t.spacing(0, 1, 0, 0),
      cursor: 'pointer',
      color: t.palette.text.secondary,
      '&:hover': {
        background: t.palette.action.hover,
      },
      '&:active, &:focus': {
        background: t.palette.action.focus,
      }
    },
    menuItemActive: {
      fontWeight: t.typography.fontWeightBold,
      color: t.palette.primary.main + ' !important',
      background: fade(t.palette.primary.main, .1) + ' !important',
    },
    menuItemCategory: {
      '&:not(:first-of-type)': {
        borderTop: `1px solid ${t.palette.divider}`
      },
    },
    cbDepartment: {
      paddingTop: `6px !important`,
      paddingBottom: `6px !important`,
    },
    flag: {
      color: 'rgba(0, 0, 0, 1)',
      fontSize: 18,
      textAlign: 'center',
    },
    iconWidth: {
      width: iconWidth,
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
  | 'placeholder'
  | 'ref'
  | 'fullWidth'> {
  countries: Country[]
  onChange: (_: string[]) => void
}

const countryToFlag = (isoCode: string) => {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode
}

interface Option {
  title: string,
  desc?: string,
  value: string | string[],
  isCountry?: boolean
}

export const SelectCountries = withRegions(({countries, ref, value, onChange, ...props}: Props) => {
  const cssUtils = useCssUtils()
  const css = useStyles()
  const {m} = useI18n()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const indexValues: UseSetState<string> = useSetState<string>()
  // const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    indexValues.reset(value)
  }, [value])

  // const indexedCountries = useMemo(() => countries.reduce((acc, country) => {
  //     acc[country.code] = country
  //     return acc
  //   }, {} as Index<Country>
  // ), [countries])

  const countriesS = useMemo(() => {
    const euCountries: Country[] = []
    const transfersCountries: Country[] = []
    const othersCountries: Country[] = []
    countries.forEach(country => {
      if (country.european) euCountries.push(country)
      else if (country.transfer) transfersCountries.push(country)
      else othersCountries.push(country)
    })
    return [{
      label: m.selectCountries_onlyEU,
      countries: euCountries
    }, {
      label: m.selectCountries_onlyTransfer,
      countries: transfersCountries
    }, {
      label: m.others,
      countries: othersCountries
    }]
  }, [countries])

  const open = (event: any) => setAnchorEl(event.currentTarget)

  const close = () => setAnchorEl(null)

  const clear = () => {
    indexValues.clear()
    onChange([])
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
        value={indexValues.toArray().join(', ')}
        // value={inputValue}
        InputProps={{
          style: {paddingRight: 4},
          // startAdornment: indexValues.toArray().map(_ =>
          //   <Chip size="small" label={_} style={{margin: 2}} onDelete={() => indexValues.delete(_)}/>
          // ),
          endAdornment: (
            <div className={css.endAdornment}>
              <IconButton size="small" onClick={_ => stopPropagation(clear)(_)} className={classes(indexValues.size === 0 && cssUtils.hidden)}>
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
      <Menu
        style={{maxHeight: 500}}
        open={!!anchorEl}
        anchorEl={anchorEl}
        // getContentAnchorEl={null}
        // anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        // transformOrigin={{vertical: 'top', horizontal: 'left'}}
        onClose={close}
      >
        {countriesS.map((countries, i) => {
          const countriesCode = countries.countries.map(_ => _.code)
          const someSelected = !!countriesCode.find(indexValues.has)
          const allSelected = countriesCode.every(indexValues.has)

          const handleSelectAll = () => {
            if (allSelected) {
              countriesCode.map(indexValues.delete)
            } else {
              countriesCode.map(indexValues.add)
            }
            onChange(indexValues.toArray())
          }

          const handleToggle = (country: Country) => {
            indexValues.toggle(country.code)
            onChange(indexValues.toArray())
          }

          return [
            <div className={classes(css.menuItem, css.menuItemCategory)} onClick={handleSelectAll}>
              <Checkbox className={css.iconWidth} indeterminate={someSelected && !allSelected} checked={allSelected}/>
              <span className={cssUtils.txtBold}>{countries.label}</span>
            </div>,
            countries.countries.map(country => (
              <div key={country.code} className={classes(css.menuItem, indexValues.has(country.code) && css.menuItemActive)}
                   onClick={() => handleToggle(country)}>
                <span className={classes(css.flag, css.iconWidth)}>{countryToFlag(country.code)}</span>
                <span>{country.name}</span>
              </div>
            ))
          ]
        })}
      </Menu>
    </>
  )
})
