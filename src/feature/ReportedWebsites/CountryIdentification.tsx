import React, {ReactElement, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {CompanySearchResult, Country, Id} from '@signal-conso/signalconso-api-sdk-js'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {fromNullable} from 'fp-ts/lib/Option'
import {alpha, Autocomplete, Box, Divider, Icon, TextField} from '@mui/material'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {IconBtn} from 'mui-extension/lib'
import {TabList, TabPanel} from "@mui/lab";
import TabContext from '@mui/lab/TabContext';
import {ScDialog} from "../../shared/Confirm/ScDialog";
import {ScInput} from "../../shared/Input/ScInput";
import {SelectCompanyList} from "../../shared/SelectCompany/SelectCompanyList";
import {useReportedWebsiteWithCompanyContext} from "../../core/context/ReportedWebsitesContext";
import {useToast} from "../../core/toast";
import {useConstantContext} from "../../core/context/ConstantContext";
import {combineSx} from "../../core/theme";
import {makeSx} from "mui-extension";

interface Props {
  country?: Country
  onChange: (_ :Country) => void
}


const css = makeSx({
  menuItem: {
    minHeight: 36,
    display: 'flex',
    alignItems: 'center',
    p: 0,
    pr: 1,
    cursor: 'pointer',
    color: t => t.palette.text.secondary,
    '&:hover': {
      background: t => t.palette.action.hover,
    },
    '&:active, &:focus': {
      background: t => t.palette.action.focus,
    },
  },
  flag: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 18,
    textAlign: 'center',
  },
  iconWidth: {
    width: 50,
  },
})

const countryToFlag = (isoCode: string) => {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode
}

export const CountryIdentification = ({onChange, country}: Props) => {
  const {m} = useI18n()
  const _countries = useConstantContext().countries

  return (
    <>
      <Autocomplete
        disablePortal
        multiple={false}
        defaultValue={country}
        id="combo-country"
        sx={{
          mb: 1.5,
          minWidth: 280,
        }}
        onChange={(event, newInputValue) => {
          const newCountry = fromNullable(newInputValue).toUndefined()
          newCountry && onChange(newCountry)
        }}
        options={_countries.entity ?? []}
        getOptionLabel={option => option.name}
        renderOption={ (props, option) =>
          <Box
            key={option.code}
            sx={css.menuItem}
          >
            <Box component="span" sx={combineSx(css.flag, css.iconWidth)}>
              {countryToFlag(option.code)}
            </Box>
            <span>{option.name}</span>
          </Box>
      }
        renderInput={params => <ScInput {...params} label={m.foreignCountry} />}
      />
    </>
  )
}
