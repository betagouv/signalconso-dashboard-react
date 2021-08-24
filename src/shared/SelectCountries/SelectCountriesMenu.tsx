import * as React from 'react'
import {forwardRef, useEffect, useMemo} from 'react'
import {useConstantContext} from '../../core/context/ConstantContext'
import {fromNullable} from 'fp-ts/lib/Option'
import {Country} from '../../core/api'
import {Checkbox, createStyles, alpha, makeStyles, Menu, Theme} from '@material-ui/core'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {useI18n} from '../../core/i18n'
import {classes} from '../../core/helper/utils'
import {useSetState, UseSetState} from '@alexandreannic/react-hooks-lib/lib'

const withRegions = (WrappedComponent: React.ComponentType<Props>) =>
  forwardRef((props: Omit<Props, 'countries'>, ref: any) => {
    const {countries} = useConstantContext()
    useEffect(() => {
      countries.fetch({force: false})
    }, [])
    return fromNullable(countries.entity)
      .map(_ => <WrappedComponent {...props} countries={_.filter(_ => _.code !== 'FR')} ref={ref}/>)
      .getOrElse(<></>)
  })

const useStyles = makeStyles((t: Theme) => {
  const iconWidth = 50
  return createStyles({
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
      },
    },
    menuItemActive: {
      fontWeight: t.typography.fontWeightBold,
      color: t.palette.primary.main + ' !important',
      background: alpha(t.palette.primary.main, 0.1) + ' !important',
    },
    menuItemCategory: {
      '&:not(:first-of-type)': {
        borderTop: `1px solid ${t.palette.divider}`,
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
  })
})

interface Props {
  onChange: (countires: string[]) => void
  initialValues: string[]
  anchorEl: HTMLElement | null
  open: boolean
  countries: Country[]
  onClose: () => void
  ref: any
}

const countryToFlag = (isoCode: string) => {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode
}

export const SelectCountriesMenu = withRegions(({countries, anchorEl, open, initialValues, onChange, onClose, ref}: Props) => {
  const cssUtils = useCssUtils()
  const css = useStyles()
  const {m} = useI18n()
  const indexedValues: UseSetState<string> = useSetState<string>()
  // const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    indexedValues.reset(initialValues)
  }, [])
  // const [inputValue, setInputValue] = useState('')

  // const indexedCountries = useMemo(() => countries.reduce((acc, country) => {
  //     acc[country.code] = country
  //     return acc
  //   }, {} as Index<Country>
  // ), [countries])

  const innerCountries = useMemo(() => {
    const euCountries: Country[] = []
    const transfersCountries: Country[] = []
    const othersCountries: Country[] = []
    countries.forEach(country => {
      if (country.european) euCountries.push(country)
      else if (country.transfer) transfersCountries.push(country)
      else othersCountries.push(country)
    })
    return [
      {
        label: m.selectCountries_onlyEU,
        countries: euCountries,
      },
      {
        label: m.selectCountries_onlyTransfer,
        countries: transfersCountries,
      },
      {
        label: m.others,
        countries: othersCountries,
      },
    ]
  }, [countries])

  // // const handleInputChange = (event: any) => {
  //   setInputValue(event.target.value)
  //   if (inputValue !== '') open(event)
  // }

  return (
    <Menu
      style={{maxHeight: 500}}
      open={open}
      anchorEl={anchorEl}
      // getContentAnchorEl={null}
      // anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
      // transformOrigin={{vertical: 'top', horizontal: 'left'}}
      onClose={onClose}
    >
      {innerCountries.map((countries, i) => {
        const countriesCode = countries.countries.map(_ => _.code)
        const someSelected = !!countriesCode.find(indexedValues.has)
        const allSelected = countriesCode.every(indexedValues.has)

        const handleSelectAll = () => {
          if (allSelected) {
            countriesCode.map(indexedValues.delete)
          } else {
            countriesCode.map(indexedValues.add)
          }
          onChange(indexedValues.toArray())
        }

        const handleToggle = (country: Country) => {
          indexedValues.toggle(country.code)
          onChange(indexedValues.toArray())
        }

        return [
          <div className={classes(css.menuItem, css.menuItemCategory)} onClick={handleSelectAll}>
            <Checkbox className={css.iconWidth} indeterminate={someSelected && !allSelected} checked={allSelected} />
            <span className={cssUtils.txtBold}>{countries.label}</span>
          </div>,
          countries.countries.map(country => (
            <div
              key={country.code}
              className={classes(css.menuItem, indexedValues.has(country.code) && css.menuItemActive)}
              onClick={() => handleToggle(country)}
            >
              <span className={classes(css.flag, css.iconWidth)}>{countryToFlag(country.code)}</span>
              <span>{country.name}</span>
            </div>
          )),
        ]
      })}
    </Menu>
  )
})
