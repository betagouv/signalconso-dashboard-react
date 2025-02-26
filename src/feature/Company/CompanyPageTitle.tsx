import { Icon } from '@mui/material'
import { Txt } from 'alexlibs/mui-extension'
import { AlbertActivityLabel } from 'shared/albert/AlbertActivityLabel'
import { PageTitle } from 'shared/Page'
import { CompanyWithReportsCount } from '../../core/model'
import { AnnuaireDesEntreprisesBanner } from './AnnuaireDesEntreprisesBanner'

export function CompanyPageTitle({
  company,
}: {
  company: CompanyWithReportsCount
}) {
  return (
    <div className="xl:flex gap-8 items-start justify-start">
      <div className="grow">
        <PageTitle>
          <div>
            {company.name}
            {company.albertActivityLabel && (
              <AlbertActivityLabel>
                {company.albertActivityLabel}
              </AlbertActivityLabel>
            )}
            {company.commercialName && (
              <Txt block size="small">
                {company.commercialName}
              </Txt>
            )}
            {company.brand && (
              <Txt block size="small" fontStyle="italic">
                {company.brand}
              </Txt>
            )}
            {company.establishmentCommercialName && (
              <Txt block size="small" fontStyle="italic">
                {company.establishmentCommercialName}
              </Txt>
            )}
            <Txt block size="big" color="hint">
              {company?.siret}
            </Txt>
            {company.isHeadOffice && (
              <div className="font-normal text-sm">
                <Icon fontSize="small" className="mb-[-4px]">
                  business
                </Icon>{' '}
                Siège social
              </div>
            )}
          </div>
        </PageTitle>
      </div>
      <div className="xl:max-w-lg">
        <AnnuaireDesEntreprisesBanner companySiret={company.siret} />
      </div>
    </div>
  )
}
