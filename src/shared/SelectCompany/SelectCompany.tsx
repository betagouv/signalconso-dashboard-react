import { ScInput } from '../ScInput'
import { IconBtn } from '../../alexlibs/mui-extension'
import { Divider, Icon } from '@mui/material'
import { SelectCompanyList } from './SelectCompanyList'
import React, { useState } from 'react'
import { useI18n } from '../../core/i18n'
import { CompanySearchResult } from '../../core/client/company/Company'
import { Id } from '../../core/model'
import { useSearchByIdentityQuery } from '../../core/queryhooks/companyQueryHooks'

export interface SelectCompanyProps {
  siret?: Id
  onChange: (_: CompanySearchResult) => void
  openOnly?: boolean
}

export const SelectCompany = ({
  siret,
  onChange,
  openOnly,
}: SelectCompanyProps) => {
  const { m } = useI18n()
  const [inputValue, setInputValue] = useState<Id | undefined>(siret)
  const [inputSiret, setInputSiret] = useState<Id | undefined>(siret)
  const _company = useSearchByIdentityQuery(inputSiret!, openOnly ?? true, {
    enabled: !!inputSiret,
  })

  return (
    <>
      <ScInput
        sx={{
          mb: 1.5,
          minWidth: 280,
        }}
        error={!!_company.error}
        helperText={_company.error ? _company.error.message : undefined}
        fullWidth
        value={inputValue ?? ''}
        placeholder={m.companySearchLabel}
        onChange={(e) => setInputValue(e.target.value)}
        InputProps={{
          endAdornment: (
            <>
              <IconBtn
                aria-label="Vider"
                onClick={() => {
                  setInputValue(undefined)
                  setInputSiret(undefined)
                }}
              >
                <Icon>clear</Icon>
              </IconBtn>
              <Divider
                sx={{ my: 0.25 }}
                orientation="vertical"
                variant="middle"
                flexItem
              />
              <IconBtn
                aria-label="Rechercher"
                loading={_company.isLoading}
                color="primary"
                sx={{ mr: -1.5 }}
                onClick={() => setInputSiret(inputValue)}
              >
                <Icon>search</Icon>
              </IconBtn>
            </>
          ),
        }}
      />
      {inputSiret && _company.data && (
        <SelectCompanyList companies={_company.data} onChange={onChange} />
      )}
    </>
  )
}
