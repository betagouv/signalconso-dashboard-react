import { ScRadioGroupItem } from '../RadioGroupItem'
import { Txt } from '../../alexlibs/mui-extension'
import { Icon } from '@mui/material'
import { ScRadioGroup } from '../RadioGroup'
import React from 'react'
import { useI18n } from '../../core/i18n'
import { AddressComponent } from '../Address'
import { sxUtils } from '../../core/theme'
import { Report } from '../../core/client/report/Report'
import { CompanySearchResult } from '../../core/client/company/Company'

interface Props {
  companies: CompanySearchResult[]
  onChange: (_: CompanySearchResult) => void
}

export const SelectCompanyList = ({ companies, onChange }: Props) => {
  const { m } = useI18n()

  return (
    <ScRadioGroup>
      {companies.map((company) => {
        const isGovernment = Report.isGovernmentCompany(company)
        return (
          <ScRadioGroupItem
            disabled={!company.isOpen}
            key={company.siret}
            value={company.siret!}
            sx={{ maxWidth: 400 }}
            onClick={() => company.isOpen && onChange(company)}
          >
            <Txt truncate block bold>
              {company.name}
            </Txt>
            {company.commercialName && (
              <Txt block>{company.commercialName}</Txt>
            )}
            {company.brand && <Txt block>{company.brand}</Txt>}
            {company.establishmentCommercialName && (
              <Txt block>{company.establishmentCommercialName}</Txt>
            )}
            {company.isHeadOffice && (
              <Txt color="primary">
                <Icon sx={sxUtils.inlineIcon}>business</Icon>
                &nbsp;
                {m.isHeadOffice}
              </Txt>
            )}
            {!company.isHeadOffice && company.activityLabel && (
              <Txt color="hint">
                <Icon sx={sxUtils.inlineIcon}>label</Icon>
                &nbsp;
                {company.activityLabel}
              </Txt>
            )}
            {isGovernment && (
              <Txt color="error" bold>
                <Icon sx={sxUtils.inlineIcon}>error</Icon>
                {m.governmentCompany}
              </Txt>
            )}
            {!company.isOpen && (
              <Txt color="error" bold>
                <Icon sx={sxUtils.inlineIcon}>error</Icon>
                {m.closedCompany}
              </Txt>
            )}
            {company.address && (
              <Txt color="hint" block size="small" sx={{ mt: 1 / 2 }}>
                <AddressComponent address={company.address} />
              </Txt>
            )}
          </ScRadioGroupItem>
        )
      })}
    </ScRadioGroup>
  )
}
