import {AddressComponent} from '../../../shared/Address'
import {PanelBody} from '../../../shared/Panel'

import {Box, Icon, useTheme} from '@mui/material'
import {NavLink} from 'react-router-dom'
import {CleanDiscreetPanel} from 'shared/Panel/simplePanels'
import {WithInlineIcon} from 'shared/WithInlineIcon'
import {Txt} from '../../../alexlibs/mui-extension'
import {Influencer, Report, Train} from '../../../core/client/report/Report'
import {useLogin} from '../../../core/context/LoginContext'
import {useI18n} from '../../../core/i18n'
import {siteMap} from '../../../core/siteMap'
import {sxUtils} from '../../../core/theme'
import {ScButton} from '../../../shared/Button'
import {ReportInfluencer} from '../ReportInfluencer'
import {SelectReportAssociation} from '../SelectReportAssociation'

interface Props {
  report: Report
  canEdit?: boolean
}

export const ReportCompany = ({report, canEdit}: Props) => {
  const {connectedUser} = useLogin()
  const {m} = useI18n()

  const {
    websiteURL,
    vendor,
    companyAddress,
    companyId,
    companyName,
    companyBrand,
    companySiret,
    phone,
    influencer,
    train,
    station,
  } = report
  return (
    <CleanDiscreetPanel>
      <div className="flex items-center justify-between">
        <div className="">
          <WithInlineIcon icon="store">
            {m.company}{' '}
            {companyId && !connectedUser.isDGAL && (
              <NavLink to={siteMap.logged.company(companyId).stats.valueAbsolute}>
                <span className="text-sm">(voir sa fiche)</span>
              </NavLink>
            )}
          </WithInlineIcon>
        </div>
        {canEdit && (
          <SelectReportAssociation reportId={report.id} currentSiret={companySiret} currentCountry={companyAddress.country}>
            <ScButton icon="edit" color="primary">
              {m.edit}
            </ScButton>
          </SelectReportAssociation>
        )}
      </div>
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
            <a href={websiteURL} target="_blank" rel="noreferrer" className="block text-scbluefrance break-all">
              {websiteURL}
            </a>
          )}
          {phone && <Phone {...{phone}} />}
          {influencer && <InfluencerBlock {...{influencer}} />}
          {train && <TrainBlock {...{train}} />}
          {station && <StationBlock {...{station}} />}
        </div>
      </PanelBody>
    </CleanDiscreetPanel>
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

function TrainBlock({train}: {train: Train}) {
  const theme = useTheme()
  const {m} = useI18n()
  const trainLabel =
    train.train === 'TER'
      ? m.Ter[train.ter as unknown as keyof typeof m.Ter]
      : train.train === 'TRAIN_DE_NUIT'
      ? m.NightTrain[train.nightTrain as unknown as keyof typeof m.NightTrain]
      : m.Train[train.train as unknown as keyof typeof m.Train]
  return (
    <Box sx={{mt: theme.spacing(4), display: 'inline-flex', alignItems: 'center'}}>
      <Icon
        sx={{
          fontSize: 20,
          mr: 0.5,
        }}
      >
        train
      </Icon>
      Train concerné : {trainLabel}
    </Box>
  )
}

function StationBlock({station}: {station: string}) {
  const theme = useTheme()
  return (
    <Box sx={{mt: theme.spacing(4), display: 'inline-flex', alignItems: 'center'}}>
      <Icon
        sx={{
          fontSize: 20,
          mr: 0.5,
        }}
      >
        subway
      </Icon>
      Gare concernée : {station}
    </Box>
  )
}
