import React, {ReactElement, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {CompanySearchResult, Id} from '@signal-conso/signalconso-api-sdk-js'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {fromNullable} from 'fp-ts/lib/Option'
import {ScDialog} from '../Confirm/ScDialog'
import {SelectCompany, SelectCompanyProps} from './SelectCompany'

interface Props extends SelectCompanyProps {
  children: ReactElement<any>
}

export const SelectCompanyDialog = ({children, onChange, siret}: Props) => {
  const {m} = useI18n()
  const [selected, setSelected] = useState<CompanySearchResult | undefined>()
  return (
    <ScDialog
      maxWidth="sm"
      title={m.companySearch}
      content={close => <SelectCompany siret={siret} onChange={setSelected} />}
      confirmDisabled={!selected}
      onConfirm={(e, close) => {
        selected && onChange(selected)
        close()
      }}
      confirmLabel={m.validate}
    >
      {children}
    </ScDialog>
  )
}
