import React, {ReactElement, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {Company, CompanySearchResult, Id} from '@signal-conso/signalconso-api-sdk-js'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {fromNullable} from 'fp-ts/lib/Option'
import {Box, Divider, Icon} from '@mui/material'
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
import {WebsiteUpdateCompany} from "@signal-conso/signalconso-api-sdk-js/lib/model";

interface Props {
  siret?: string
  onChange: (_: WebsiteUpdateCompany) => void
}

export const CompanyIdentification = ({onChange, siret}: Props) => {
  const {m} = useI18n()
  const _company = useCompaniesContext().searchByIdentity
  const [inputValue, setInputValue] = useState<Id | undefined>(siret)
  const {toastError, toastInfo, toastSuccess} = useToast()

  useEffect(() => {
    fromNullable(siret)
      .filter(x => x === inputValue)
      .map(setInputValue)
    search()
  }, [siret])

  const search = () => {
    if (inputValue) _company.fetch({}, inputValue)
  }

  return (
    <>
      <ScInput
        sx={{
          mb: 1.5,
          minWidth: 280,
        }}
        fullWidth
        value={(inputValue) ?? ''}
        placeholder={m.companySearchLabel}
        onChange={e => setInputValue(e.target.value)}
        InputProps={{
          endAdornment: (
            <>
              <IconBtn
                style={{marginRight: -12}}
                onClick={() => {
                  setInputValue(undefined)
                  _company.clearCache()
                }}
              >
                <Icon>clear</Icon>
              </IconBtn>
              <Divider sx={{ml: 1.5}} orientation="vertical" variant="middle" flexItem/>
              <IconBtn
                style={{marginRight: -12, border: 1.5}}
                onClick={() => {
                  search()
                }}
              >
                <Icon>search</Icon>
              </IconBtn>
            </>
          ),
        }}
      />

      {_company.entity && (
        <SelectCompanyList
          companies={_company.entity}
          onChange={onChange}
        />
      )}
    </>
  )
}
