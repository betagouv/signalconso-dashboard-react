import { Icon } from '@mui/material'
import { ReportUtils } from 'core/client/report/Report'
import { Txt } from '../../alexlibs/mui-extension'
import { CompanySearchResult } from '../../core/client/company/Company'
import { useI18n } from '../../core/i18n'
import { sxUtils } from '../../core/theme'
import { AddressComponent } from '../Address'
import { ScRadioGroup } from '../RadioGroup'
import { ScRadioGroupItem } from '../RadioGroupItem'

interface Props {
  companies: CompanySearchResult[]
  onChange: (_: CompanySearchResult) => void
}

export const SelectCompanyList = ({ companies, onChange }: Props) => {
  const { m } = useI18n()

  return (
    <ScRadioGroup>
      {companies.map((company) => {
        const isGovernment = ReportUtils.isGovernmentCompany(company)
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
