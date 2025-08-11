import WarningOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { Icon, Tooltip } from '@mui/material'
import { isAddressEmpty } from 'core/model/Address'
import { AlbertActivityLabel } from 'shared/albert/AlbertActivityLabel'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'
import { ReportBlockTitle } from 'shared/ReportBlockTitle'
import { ReportElementRow, ReportElementsGrid } from 'shared/tinyComponents'
import {
  Influencer,
  ReportExtra,
  ReportUtils,
  SpecialLegislation,
} from '../../../core/client/report/Report'
import { useConnectedContext } from '../../../core/context/connected/connectedContext'
import { useI18n } from '../../../core/i18n'
import { AddressComponent } from '../../../shared/Address'
import { ScButton } from '../../../shared/Button'
import {
  QuickSmallExternalLink,
  QuickSmallLink,
  QuickSmallReportSearchLink,
} from '../quickSmallLinks'
import { ReportInfluencer } from '../ReportInfluencer'
import { ReportStation } from '../ReportStation'
import { ReportTrain } from '../ReportTrain'
import { SelectReportAssociation } from '../SelectReportAssociation'
export const ReportCompany = ({
  reportExtra: r,
  canEdit,
}: {
  reportExtra: ReportExtra
  canEdit?: boolean
}) => {
  const { connectedUser } = useConnectedContext()
  const { m } = useI18n()

  const specialLegislation = ReportUtils.appliedSpecialLegislation(r.report)
  const {
    websiteURL,
    vendor,
    companyAddress,
    companyId,
    companyName,
    companyCommercialName,
    companyEstablishmentCommercialName,
    companyBrand,
    companySiret,
    phone,
    influencer,
    train,
    station,
    id,
  } = r.report
  const { companyAlbertActivityLabel } = r
  return (
    <CleanDiscreetPanel>
      <div className="flex items-center justify-between">
        <div className="">
          <ReportBlockTitle icon="store">{m.company} </ReportBlockTitle>
          {companyId && !connectedUser.isDGAL && !connectedUser.isSSMVM && (
            <QuickSmallLink
              label="fiche entreprise"
              to="/entreprise/$companyId/bilan"
              params={{ companyId }}
              icon="forward"
            />
          )}
        </div>
        {canEdit && (
          <SelectReportAssociation
            reportId={id}
            currentSiret={companySiret}
            currentCountry={companyAddress.country}
          >
            <ScButton icon="edit" color="primary">
              {m.edit}
            </ScButton>
          </SelectReportAssociation>
        )}
      </div>

      <div className="space-y-2">
        {companyAlbertActivityLabel && (
          <AlbertActivityLabel smaller withExplainButton={true}>
            {companyAlbertActivityLabel}
          </AlbertActivityLabel>
        )}
        {specialLegislation && (
          <SpecialLegislationBlock specialLegislation={specialLegislation} />
        )}
        <ReportElementsGrid>
          {companySiret && (
            <ReportElementRow label="Siret">
              <span>{companySiret}</span>
              <div className="space-x-2 -mt-1.5">
                <QuickSmallReportSearchLink
                  reportSearch={{
                    siretSirenList: [companySiret],
                    hasCompany: true,
                  }}
                />
                <QuickSmallExternalLink
                  label="Annuaire des Entreprises"
                  href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${companySiret.trim()}}`}
                />
              </div>
            </ReportElementRow>
          )}
          {(companyName ||
            companyCommercialName ||
            companyEstablishmentCommercialName ||
            companyBrand) && (
            <ReportElementRow label="Nom">
              <div className="text-sm">
                {companyName && (
                  <div className="font-bold text-base">{companyName}</div>
                )}
                {companyCommercialName && <div>{companyCommercialName}</div>}
                {companyEstablishmentCommercialName && (
                  <div className="italic">
                    {companyEstablishmentCommercialName}
                  </div>
                )}
                {companyBrand && <div className="italic">{companyBrand}</div>}
              </div>
            </ReportElementRow>
          )}
          {!isAddressEmpty(companyAddress) && (
            <ReportElementRow label="Adresse">
              <AddressComponent address={companyAddress} />
            </ReportElementRow>
          )}
          {websiteURL && (
            <ReportElementRow label="Site">
              <a
                href={websiteURL}
                target="_blank"
                rel="noreferrer"
                className="block text-base"
              >
                {websiteURL}
              </a>
              <div className="-mt-1.5">
                <QuickSmallReportSearchLink
                  reportSearch={{
                    websiteURL: websiteURL,
                    hasWebsite: true,
                  }}
                />
              </div>
            </ReportElementRow>
          )}
          {vendor && (
            <MarketplaceBlock vendor={vendor} marketplace={companyName ?? ''} />
          )}
          {phone && <Phone {...{ phone }} />}
          {influencer && <InfluencerBlock {...{ influencer }} />}
          {train && <ReportTrain {...{ train }} />}
          {station && <ReportStation {...{ station }} />}
        </ReportElementsGrid>
      </div>
    </CleanDiscreetPanel>
  )
}

function Phone({ phone }: { phone: string }) {
  return (
    <ReportElementRow label="Téléphone">
      <div className="space-x-2">
        <span className="">
          <Icon
            style={{ fontSize: '1.1em' }}
            className="mb-[-4px] ml-[-2px] mr-0.5"
          >
            phone
          </Icon>
          <span>{phone}</span>
        </span>
        <span className="-translate-y-[2px] inline-block">
          <QuickSmallReportSearchLink
            reportSearch={{
              phone,
              hasPhone: true,
            }}
          />
        </span>
      </div>
    </ReportElementRow>
  )
}

function MarketplaceBlock({
  vendor,
  marketplace,
}: {
  vendor: string
  marketplace: string
}) {
  const { m } = useI18n()
  return (
    <ReportElementRow
      label={
        <Tooltip arrow title={m.marketplaceVendorDesc(marketplace)}>
          <span className="cursor-pointer">
            Vendeur
            <Icon fontSize="small" sx={{ mb: -0.5, ml: 0.5 }}>
              help_outline
            </Icon>
          </span>
        </Tooltip>
      }
    >
      {vendor}
    </ReportElementRow>
  )
}

function InfluencerBlock({ influencer }: { influencer: Influencer }) {
  return (
    <ReportElementRow label="Influenceur">
      <ReportInfluencer influencer={influencer} />
    </ReportElementRow>
  )
}

function SpecialLegislationBlock({
  specialLegislation,
}: {
  specialLegislation: SpecialLegislation
}) {
  const { m } = useI18n()
  return (
    <div className="bg-yellow-100 py-2 px-4 border border-black border-solid">
      <WarningOutlinedIcon fontSize="small" className="mt-[-4px] mr-1" />
      <span
        className="text-sm"
        dangerouslySetInnerHTML={{
          __html: m.specialLegislation[specialLegislation],
        }}
      />
    </div>
  )
}
