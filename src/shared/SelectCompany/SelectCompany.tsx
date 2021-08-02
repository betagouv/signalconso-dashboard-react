import {Confirm} from 'mui-extension'
import React, {ReactElement, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {ScInput} from '../Input/ScInput'
import {CompanySearchResult, Id} from '../../core/api'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {fromNullable} from 'fp-ts/lib/Option'
import {Icon, makeStyles, Theme} from '@material-ui/core'
import {SelectCompanyList} from './SelectCompanyList'
import {IconBtn} from 'mui-extension/lib'

interface Props {
  children: ReactElement<any>
  companyId?: Id
  onChange: (_: CompanySearchResult) => void
}

const useStyles = makeStyles((t: Theme) => ({
  input: {
    marginBottom: t.spacing(1.5),
    minWidth: 280,
  },
}))

export const SelectCompany = ({children, onChange, companyId}: Props) => {
  const {m} = useI18n()
  const _company = useCompaniesContext().searchByIdentity
  const [inputValue, setInputValue] = useState<Id | undefined>(undefined)
  const css = useStyles()

  useEffect(() => {
    fromNullable(companyId).filter(_ => _ === inputValue).map(setInputValue)
  }, [companyId])

  const search = () => {
    if (inputValue) _company.fetch({}, inputValue)
  }

  return (
    <Confirm
      maxWidth="sm"
      loading={_company.loading}
      title={m.companySearch}
      content={close =>
        <>
          <ScInput
            className={css.input}
            fullWidth
            value={inputValue ?? ''}
            placeholder={m.companySearchLabel}
            onChange={e => setInputValue(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconBtn style={{marginRight: -12}} onClick={() => {
                  setInputValue(undefined)
                  _company.clearCache()
                }}>
                  <Icon>clear</Icon>
                </IconBtn>
              )
            }}
          />
          {_company.entity && <SelectCompanyList companies={_company.entity} onChange={_ => {
            onChange(_)
            setTimeout(close, 300)
          }}/>}
        </>
      }
      onConfirm={search}
      confirmLabel={m.search}
      cancelLabel={m.close}
    >
      {children}
    </Confirm>
  )
}
