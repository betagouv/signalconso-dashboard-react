import React, { ReactElement, useState } from 'react'
import { useI18n } from '../../core/i18n'

import { ScDialog } from '../ScDialog'
import { SelectCompany, SelectCompanyProps } from './SelectCompany'
import { CompanySearchResult } from '../../core/client/company/Company'

interface Props extends SelectCompanyProps {
  children: ReactElement<any>
}

export const SelectCompanyDialog = ({
  children,
  onChange,
  siret,
  openOnly,
}: Props) => {
  const { m } = useI18n()
  const [selected, setSelected] = useState<CompanySearchResult | undefined>()
  return (
    <ScDialog
      maxWidth="sm"
      title={m.companySearch}
      content={(close) => (
        <SelectCompany
          siret={siret}
          onChange={setSelected}
          openOnly={openOnly}
        />
      )}
      confirmDisabled={!selected}
      onConfirm={(e, close) => {
        if (selected) {
          onChange(selected)
        }
        return close()
      }}
      confirmLabel={m.validate}
    >
      {children}
    </ScDialog>
  )
}
