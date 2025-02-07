import { Box, Icon, Skeleton, Tooltip } from '@mui/material'
import { ScOption } from 'core/helper/ScOption'
import { NavLink } from 'react-router'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { useMemoFn } from '../../../alexlibs/react-hooks-lib'
import { useI18n } from '../../../core/i18n'
import { useGetCloudWordQuery } from '../../../core/queryhooks/reportQueryHooks'
import { siteMap } from '../../../core/siteMap'
import { HorizontalBarChartData } from '../../../shared/Chart/HorizontalBarChart'
import { CompanyStatsPanelTitle } from './CompanyStatsPanelTitle'

interface Props {
  companyId: string
}

export const ReportWordDistribution = ({ companyId }: Props) => {
  const { m } = useI18n()
  const _wordDistribution = useGetCloudWordQuery(companyId)

  const reviewDistribution: HorizontalBarChartData[] | undefined = useMemoFn(
    _wordDistribution.data,
    (_) =>
      _.length > 0
        ? Object.entries(_).map(([label, reportWordCount], index) => ({
            label: (
              <NavLink
                to={siteMap.logged.reports({
                  description: reportWordCount.value,
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
    <CleanInvisiblePanel loading={_wordDistribution.isLoading}>
      <CompanyStatsPanelTitle bottomMargin>
        <Tooltip title={m.helpCloudWord}>
          <Box>
            {m.reportCloudWord}
            <Icon fontSize="small" className="ml-1 mb-[-3px]">
              help_outline
            </Icon>
          </Box>
        </Tooltip>
      </CompanyStatsPanelTitle>
      {ScOption.from(_wordDistribution.data)
        .map((_) => (
          <>
            {reviewDistribution && reviewDistribution.length > 1 ? (
              <ul className="flex flex-wrap gap-2">
                {reviewDistribution.map((host, i) => (
                  <li key={i} className="italic">
                    {host.label}
                  </li>
                ))}
              </ul>
            ) : (
              m.cannotGenerateCloudWord
            )}
          </>
        ))
        .getOrElse(
          <>
            <Skeleton height={66} width="100%" />
          </>,
        )}
    </CleanInvisiblePanel>
  )
}
