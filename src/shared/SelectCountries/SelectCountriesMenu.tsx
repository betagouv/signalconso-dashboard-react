import * as React from 'react'
import { useEffect, useMemo } from 'react'

import { alpha, Box, Checkbox, Menu, MenuItem } from '@mui/material'
import { ScOption } from 'core/helper/ScOption'
import { makeSx } from '../../alexlibs/mui-extension'
import { useSetState, UseSetState } from '../../alexlibs/react-hooks-lib'
import { Country } from '../../core/client/constant/Country'
import { countryToFlag } from '../../core/helper'
import { useI18n } from '../../core/i18n'
import { useCountriesQuery } from '../../core/queryhooks/constantQueryHooks'
import { combineSx } from '../../core/theme'

const withRegions =
  (WrappedComponent: React.ComponentType<Props>) =>
  (props: Omit<Props, 'countries'>) => {
    const countries = useCountriesQuery()

    return ScOption.from(countries.data)
      .map((_) => (
        <WrappedComponent
          {...props}
          countries={_.filter((_) => _.code !== 'FR')}
        />
      ))
      .getOrElse(<></>)
  }

const iconWidth = 50
const css = makeSx({
  menuItem: {
    minHeight: 36,
    display: 'flex',
    alignItems: 'center',
    p: 0,
    pr: 1,
    cursor: 'pointer',
    color: (t) => t.palette.text.secondary,
    '&:hover': {
      background: (t) => t.palette.action.hover,
    },
    '&:active, &:focus': {
      background: (t) => t.palette.action.focus,
    },
  },
  menuItemActive: {
    fontWeight: (t) => t.typography.fontWeightBold,
    color: (t) => t.palette.primary.main + ' !important',
    background: (t) => alpha(t.palette.primary.main, 0.1) + ' !important',
  },
  menuItemCategory: {
    '&:not(:first-of-type)': {
      borderTop: (t) => `1px solid ${t.palette.divider}`,
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
  innerCheckbox: {
    ml: '15px',
  },
})

interface Props {
  onChange: (countires: string[]) => void
  initialValues: string[]
  anchorEl: HTMLElement | null
  open: boolean
  countries: Country[]
  onClose: () => void
}

export const SelectCountriesMenu = withRegions(
  ({ countries, anchorEl, open, initialValues, onChange, onClose }: Props) => {
    const { m } = useI18n()
    const indexedValues: UseSetState<string> = useSetState<string>()

    useEffect(() => {
      indexedValues.reset(initialValues)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const innerCountries = useMemo(() => {
      const euCountries: Country[] = []
      const transfersCountries: Country[] = []
      const othersCountries: Country[] = []
      countries.forEach((country) => {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countries])

    return (
      <Menu
        style={{ maxHeight: 500 }}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
      >
        {innerCountries.map((countries, i) => {
          const countriesCode = countries.countries.map((_) => _.code)
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
            <MenuItem
              sx={combineSx(css.menuItem, css.menuItemCategory)}
              onClick={handleSelectAll}
            >
              <Checkbox
                slotProps={{
                  input: {
                    'aria-label': allSelected
                      ? `Désélectionner ${countries.label}`
                      : `Sélectionner ${countries.label}`,
                  },
                }}
                sx={css.iconWidth}
                indeterminate={someSelected && !allSelected}
                checked={allSelected}
              />
              <Box
                component="span"
                sx={{ fontWeight: (t) => t.typography.fontWeightBold }}
              >
                {countries.label}
              </Box>
            </MenuItem>,
            countries.countries.map((country) => (
              <MenuItem
                key={country.code}
                sx={combineSx(
                  css.menuItem,
                  indexedValues.has(country.code) && css.menuItemActive,
                )}
                onClick={() => handleToggle(country)}
              >
                <Checkbox
                  slotProps={{
                    input: {
                      'aria-label': indexedValues.has(country.code)
                        ? `Désélectionner ${country.name}`
                        : `Sélectionner ${country.name}`,
                    },
                  }}
                  sx={combineSx(css.innerCheckbox, css.iconWidth)}
                  checked={indexedValues.has(country.code)}
                />
                <Box component="span" sx={combineSx(css.flag, css.iconWidth)}>
                  {countryToFlag(country.code)}
                </Box>
                <span>{country.name}</span>
              </MenuItem>
            )),
          ]
        })}
      </Menu>
    )
  },
)
