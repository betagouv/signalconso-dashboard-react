import { Box, Icon, Tooltip, useTheme } from '@mui/material'
import { Link } from '@tanstack/react-router'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'
import { WithInlineIcon } from 'shared/WithInlineIcon'
import { AlbertActivityLabel } from 'shared/albert/AlbertActivityLabel'
import { ReportWebsiteUrlLink } from 'shared/tinyComponents'
import { Txt } from '../../../alexlibs/mui-extension'
import {
  Influencer,
  ReportExtra,
  ReportUtils,
} from '../../../core/client/report/Report'
import { useConnectedContext } from '../../../core/context/connected/connectedContext'
import { useI18n } from '../../../core/i18n'
import { sxUtils } from '../../../core/theme'
import { AddressComponent } from '../../../shared/Address'
import { ScButton } from '../../../shared/Button'
import { ReportInfluencer } from '../ReportInfluencer'
import ReportSearchNavLink from '../ReportSearchNavLink'
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
          <WithInlineIcon icon="store">
            {m.company}{' '}
            {companyId && !connectedUser.isDGAL && (
              <Link to="/entreprise/$companyId/bilan" params={{ companyId }}>
                <span className="text-sm">(voir sa fiche)</span>
              </Link>
            )}
          </WithInlineIcon>
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
      <div className={specialLegislation ? 'bg-yellow-100 py-2 px-4' : ''}>
        {specialLegislation && (
          <div
            className="text-sm text-yellow-700 mb-4"
            dangerouslySetInnerHTML={{
              __html: m.specialLegislation[specialLegislation],
            }}
          />
        )}
        <div>
          {companyAlbertActivityLabel && (
            <AlbertActivityLabel smaller withExplainButton={true}>
              {companyAlbertActivityLabel}
            </AlbertActivityLabel>
          )}
          {companySiret && (
            <div className={'flex flex-row gap-3'}>
              <div className="mb-1">
                <ReportSearchNavLink
                  reportSearch={{
                    siretSirenList: [companySiret],
                    hasCompany: true,
                  }}
                  value={companySiret}
                />
              </div>
              <a
                href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${companySiret.trim()}}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-sm">(Annuaire des Entreprises)</span>
              </a>
            </div>
          )}

          <div className="text-gray-500 text-sm">
            {companyName && <div className="font-bold">{companyName}</div>}

            {companyCommercialName && <div>{companyCommercialName}</div>}
            {companyEstablishmentCommercialName && (
              <div className="italic">{companyEstablishmentCommercialName}</div>
            )}
            {companyBrand && <div className="italic">{companyBrand}</div>}
            <AddressComponent address={companyAddress} />
          </div>
          {websiteURL && <ReportWebsiteUrlLink {...{ websiteURL }} />}
          {vendor && (
            <MarketplaceBlock vendor={vendor} marketplace={companyName ?? ''} />
          )}
          {phone && <Phone {...{ phone }} />}
          {influencer && <InfluencerBlock {...{ influencer }} />}
          {train && <ReportTrain {...{ train }} />}
          {station && <ReportStation {...{ station }} />}
        </div>
      </div>
    </CleanDiscreetPanel>
  )
}

function Phone({ phone }: { phone: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <Icon
        sx={{
          fontSize: 20,
          mr: 0.5,
        }}
      >
        phone
      </Icon>
      <ReportSearchNavLink
        reportSearch={{
          phone: phone,
          hasPhone: true,
        }}
        value={phone}
      />
    </div>
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
    <div>
      <Tooltip arrow title={m.marketplaceVendorDesc(marketplace)}>
        <span className="pointer">
          <span>
            <Txt sx={sxUtils.fontBig}>{m.marketplaceVendorTitle}</Txt>
            <Icon fontSize="small" sx={{ mb: -0.5, ml: 0.5 }}>
              help_outline
            </Icon>
          </span>
        </span>
      </Tooltip>
      : {vendor}
    </div>
  )
}

function InfluencerBlock({ influencer }: { influencer: Influencer }) {
  const theme = useTheme()
  const { m } = useI18n()

  return (
    <Box sx={{ mt: theme.spacing(2) }}>
      <Txt sx={sxUtils.fontBig}>{m.influencerIdentifiedTitle}</Txt>
      <ReportInfluencer influencer={influencer} />
    </Box>
  )
}
