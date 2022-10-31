import * as React from 'react'
import {useEffect} from 'react'
import {useI18n} from '../../../core/i18n'
import {Box, Icon, Skeleton, Tooltip} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '../../../shared/Panel'
import {HorizontalBarChart, HorizontalBarChartData} from '../../../shared/HorizontalBarChart/HorizontalBarChart'
import {useEffectFn, useFetcher} from '../../../alexlibs/react-hooks-lib'
import {useToast} from '../../../core/toast'
import {useMemoFn} from '../../../alexlibs/react-hooks-lib'
import {ScOption} from 'core/helper/ScOption'
import {Id} from '../../../core/model'
import {useLogin} from '../../../core/context/LoginContext'
import {siteMap} from '../../../core/siteMap'
import {NavLink} from 'react-router-dom'

interface Props {
  companyId: string
}

export const ReportWordDistribution = ({companyId}: Props) => {
  const {m} = useI18n()
  const {apiSdk} = useLogin()
  const _cloudWord = useFetcher((companyId: Id) => apiSdk.secured.reports.getCloudWord(companyId))
  const {toastError} = useToast()
  useEffect(() => {
    _cloudWord.fetch({}, companyId)
  }, [companyId])

  useEffectFn(_cloudWord.error, toastError)

  const reviewDistribution: HorizontalBarChartData[] | undefined = useMemoFn(_cloudWord.entity, _ =>
    _.length > 0
      ? Object.entries(_).map(([label, reportWordCount]) => ({
          label: (
            <NavLink
              to={siteMap.logged.reports({
                details: reportWordCount.value,
                companyIds: [companyId],
              })}
            >
              {reportWordCount.value}
            </NavLink>
          ),
          value: reportWordCount.count,
        }))
      : [],
  )

  return (
    <Panel loading={_cloudWord.loading}>
      <PanelHead>
        <Tooltip title={m.helpCloudWord}>
          <Box sx={{display: 'flex'}}>
            {m.reportCloudWord}
            <Icon sx={{color: t => t.palette.text.disabled, marginLeft: '5px'}} fontSize="medium">
              help
            </Icon>
          </Box>
        </Tooltip>
      </PanelHead>
      {ScOption.from(_cloudWord.entity)
        .map(_ => (
          <PanelBody>
            {reviewDistribution && reviewDistribution.length > 1 ? (
              <HorizontalBarChart width={120} data={reviewDistribution} grid />
            ) : (
              m.cannotGenerateCloudWord
            )}
          </PanelBody>
        ))
        .getOrElse(
          <PanelBody>
            <Skeleton height={66} width="100%" />
          </PanelBody>,
        )}
    </Panel>
  )
}
