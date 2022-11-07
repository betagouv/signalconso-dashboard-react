import * as React from 'react'
import {useEffect} from 'react'
import {useI18n} from '../../../core/i18n'
import {Box, Icon, List, ListItem, Skeleton, Tooltip} from '@mui/material'
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
  const _wordDistribution = useFetcher((companyId: Id) => apiSdk.secured.reports.getCloudWord(companyId))
  const {toastError} = useToast()
  useEffect(() => {
    _wordDistribution.fetch({}, companyId)
  }, [companyId])

  useEffectFn(_wordDistribution.error, toastError)

  const reviewDistribution: HorizontalBarChartData[] | undefined = useMemoFn(_wordDistribution.entity, _ =>
    _.length > 0
      ? Object.entries(_).map(([label, reportWordCount], index) => ({
          label: (
            <NavLink
              to={siteMap.logged.reports({
                description: reportWordCount.value,
                companyIds: [companyId],
              })}
            >
              {index + 1} - {reportWordCount.value}
            </NavLink>
          ),
          value: reportWordCount.count,
        }))
      : [],
  )

  return (
    <Panel loading={_wordDistribution.loading}>
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
      {ScOption.from(_wordDistribution.entity)
        .map(_ => (
          <PanelBody>
            {reviewDistribution && reviewDistribution.length > 1 ? (
              <Box sx={{maxHeight: 260, overflow: 'auto'}}>
                <List dense>
                  {reviewDistribution.map((host, i) => (
                    <ListItem key={i}>{host.label}</ListItem>
                  ))}
                </List>
              </Box>
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
