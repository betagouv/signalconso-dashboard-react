import React, {ReactElement, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {ScInput} from '../Input/ScInput'
import {CompanySearchResult, Id} from '@signal-conso/signalconso-api-sdk-js'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {fromNullable} from 'fp-ts/lib/Option'
import {Icon} from '@mui/material'
import {SelectCompanyList} from './SelectCompanyList'
import {IconBtn} from 'mui-extension/lib'
import {ScDialog} from '../Confirm/ScDialog'

interface Props {
  children: ReactElement<any>
  siret?: Id
  onChange: (_: CompanySearchResult) => void
}

export const SelectCompany = ({children, onChange, siret}: Props) => {
  const {m} = useI18n()
  const _company = useCompaniesContext().searchByIdentity
  const [inputValue, setInputValue] = useState<Id | undefined>(siret)

  useEffect(() => {
    fromNullable(siret)
      .filter(x => x === inputValue)
      .map(setInputValue)
  }, [siret])

  const search = () => {
    if (inputValue) _company.fetch({}, inputValue)
  }

  return (
    <ScDialog
      onClick={_ => search()}
      maxWidth="sm"
      loading={_company.loading}
      title={m.companySearch}
      content={close => (
        <>
          <ScInput
            sx={{
              mb: 1.5,
              minWidth: 280,
            }}
            fullWidth
            value={inputValue ?? ''}
            placeholder={m.companySearchLabel}
            onChange={e => setInputValue(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconBtn
                  style={{marginRight: -12}}
                  onClick={() => {
                    setInputValue(undefined)
                    _company.clearCache()
                  }}
                >
                  <Icon>clear</Icon>
                </IconBtn>
              ),
            }}
          />
          {_company.entity && (
            <SelectCompanyList
              companies={_company.entity}
              onChange={_ => {
                onChange(_)
                setTimeout(close, 300)
              }}
            />
          )}
        </>
      )}
      onConfirm={search}
      confirmLabel={m.search}
    >
      {children}
    </ScDialog>
  )
}
