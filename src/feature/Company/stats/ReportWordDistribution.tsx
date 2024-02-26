import * as React from 'react'
import {useI18n} from '../../../core/i18n'
import {Box, Icon, List, ListItem, Skeleton, Tooltip} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '../../../shared/Panel'
import {HorizontalBarChartData} from '../../../shared/Chart/HorizontalBarChart'
import {useMemoFn} from '../../../alexlibs/react-hooks-lib'
import {ScOption} from 'core/helper/ScOption'
import {siteMap} from '../../../core/siteMap'
import {NavLink} from 'react-router-dom'
import {useGetCloudWordQuery} from '../../../core/queryhooks/reportQueryHooks'

interface Props {
  companyId: string
}

export const ReportWordDistribution = ({companyId}: Props) => {
  const {m} = useI18n()
  const _wordDistribution = useGetCloudWordQuery(companyId)

  const reviewDistribution: HorizontalBarChartData[] | undefined = useMemoFn(_wordDistribution.data, _ =>
    _.length > 0
      ? Object.entries(_).map(([label, reportWordCount], index) => ({
          label: (
            <NavLink
              to={siteMap.logged.reports.open({
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
    <Panel loading={_wordDistribution.isLoading}>
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
      {ScOption.from(_wordDistribution.data)
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
