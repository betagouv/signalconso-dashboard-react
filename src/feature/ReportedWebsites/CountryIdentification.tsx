import React, {ReactElement, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {CompanySearchResult, Country, Id} from '@signal-conso/signalconso-api-sdk-js'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {fromNullable} from 'fp-ts/lib/Option'
import {Autocomplete, Box, Divider, Icon, TextField} from '@mui/material'
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

interface Props {
  country?: Country
  onChange: (_ :Country) => void
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
          width: 300,
        }}
        onChange={(event, newInputValue) => {
          const newCountry = fromNullable(newInputValue).toUndefined()
          newCountry && onChange(newCountry)
        }}
        options={_countries.entity ?? []}
        getOptionLabel={option => option.name}
        renderInput={params => <TextField {...params} label={m.foreignCountry} />}
      />
    </>
  )
}
