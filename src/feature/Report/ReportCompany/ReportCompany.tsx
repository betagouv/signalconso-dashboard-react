import {AddressComponent} from '../../../shared/Address'
import {Panel, PanelBody, PanelHead} from '../../../shared/Panel'

import {Box, Icon, useTheme} from '@mui/material'
import {NavLink} from 'react-router-dom'
import {WithInlineIcon} from 'shared/WithInlineIcon'
import {Txt} from '../../../alexlibs/mui-extension'
import {Influencer, Report} from '../../../core/client/report/Report'
import {useReportContext} from '../../../core/context/ReportContext'
import {useI18n} from '../../../core/i18n'
import {siteMap} from '../../../core/siteMap'
import {sxUtils} from '../../../core/theme'
import {ScButton} from '../../../shared/Button'
import {ReportInfluencer} from '../ReportInfluencer'
import {SelectReportAssociation} from '../SelectReportAssociation'
import {useLogin} from '../../../core/context/LoginContext'

interface Props {
  report: Report
  canEdit?: boolean
}

export const ReportCompany = ({report, canEdit}: Props) => {
  const _report = useReportContext()
  const {connectedUser} = useLogin()
  const {m} = useI18n()
  const {websiteURL, vendor, companyAddress, companyId, companyName, companyBrand, companySiret, phone, influencer} = report
  return (
    <Panel stretch>
      <PanelHead
        action={
          canEdit && (
            <SelectReportAssociation reportId={report.id} currentSiret={companySiret} currentCountry={companyAddress.country}>
              <ScButton icon="edit" color="primary" loading={_report.updateCompany.loading}>
                {m.edit}
              </ScButton>
            </SelectReportAssociation>
          )
        }
      >
        <div className="">
          <WithInlineIcon icon="store">
            {m.company}{' '}
            {companyId && !connectedUser.isDGAL && (
              <NavLink to={siteMap.logged.company(companyId)}>
                <span className="text-sm">(voir sa fiche)</span>
              </NavLink>
            )}
          </WithInlineIcon>
        </div>
      </PanelHead>
      <PanelBody className="flex justify-between">
        <div>
          {companySiret && <div className="mb-1">{companySiret}</div>}
          <div className="text-gray-500 text-sm">
            {companyName && <div className="font-bold">{companyName}</div>}
            {companyBrand && <div className="italic">{companyBrand}</div>}
            <AddressComponent address={companyAddress} />
          </div>
          {vendor && <div>{vendor}</div>}
          {websiteURL && (
            <Txt link block sx={{mt: 1}}>
              <a href={websiteURL} target="_blank" rel="noreferrer">
                {websiteURL}
              </a>
            </Txt>
          )}
          {phone && <Phone {...{phone}} />}
          {influencer && <InfluencerBlock {...{influencer}} />}
        </div>
      </PanelBody>
    </Panel>
  )
}

function Phone({phone}: {phone: string}) {
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
      {phone}
    </div>
  )
}

function InfluencerBlock({influencer}: {influencer: Influencer}) {
  const theme = useTheme()
  const {m} = useI18n()

  return (
    <Box sx={{mt: theme.spacing(2)}}>
      <Txt sx={sxUtils.fontBig}>{m.influencerIdentifiedTitle}</Txt>
      <ReportInfluencer influencer={influencer} />
    </Box>
  )
}
