import * as React from 'react'
import {useEffect, useMemo} from 'react'
import {useConstantContext} from '../../core/context/ConstantContext'
import {fromNullable} from 'fp-ts/lib/Option'
import {Country, Index} from '../../core/api'
import {Checkbox, TextField} from '@material-ui/core'
import {Autocomplete, AutocompleteProps} from '@material-ui/lab'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {useI18n} from '../../core/i18n'

const withRegions = (WrappedComponent: React.ComponentType<Props>) => React.forwardRef((props: Omit<Props, 'countries'>, ref) => {
  const {countries} = useConstantContext()
  useEffect(() => {
    countries.fetch()()
  }, [])
  return fromNullable(countries.entity).map(_ => <WrappedComponent {...props} countries={_.filter(_ => _.code !== 'FR')} ref={ref}/>).getOrElse(<></>)
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
  // fullWidth?: boolean
  // className?: string
  // placeholder?: string
  // ref?: any
  // defaultValue?: string[]
  // value: string[]
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
  const utilsCss = useUtilsCss()
  const {m} = useI18n()
  const indexedCountries = useMemo(() => countries.reduce((acc, country) => {
      acc[country.code] = country
      return acc
    }, {} as Index<Country>
  ), [countries])
  const options = useMemo(() => countries
    .sort((a, b) => a.transfer && !b.transfer ? -1 : a.european && !b.european ? -1 : 1)
    .map(_ => _.code), [countries])
  // const options: Option[] = useMemo(() => [
  //   {title: m.selectCountries_onlyEU, value: countries.filter(_ => _.transfer).map(_ => _.code)},
  //   {title: m.selectCountries_onlyTransfer, value: countries.filter(_ => _.european).map(_ => _.code)},
  //   ...countries.map(_ => ({title: _.name, value: _.code, isCountry: true}))
  // ], countries)
  return (
    <>
      <Autocomplete
        ref={ref}
        options={options}
        autoHighlight
        multiple
        size="small"
        {...props}
        onChange={(_, value) => onChange(value)}
        groupBy={(options: keyof typeof indexedCountries) => {
          if (indexedCountries[options].european) return <>EU<div><Checkbox/></div></> as any
          if (indexedCountries[options].transfer) return 'TRANSFER'
          return 'autres'
        }}
        getOptionLabel={(option) => indexedCountries[option].name}
        renderOption={(option) => {
          const country = indexedCountries[option]
          return (
            <React.Fragment>
              <span className={utilsCss.txtTitle}>{countryToFlag(country.code.slice(0, 2))}</span>
              &nbsp;
              {country.name}
            </React.Fragment>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            margin="dense"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
    </>
  )
})
