import { Icon, Tooltip } from '@mui/material'
import { objectEntriesUnsafe } from 'core/helper'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { useMemoFn } from '../../../alexlibs/react-hooks-lib'
import {
  ReportStatus,
  ReportStatusPro,
} from '../../../core/client/report/Report'
import { HorizontalBarChart } from '../../../shared/Chart/HorizontalBarChart'
import { CompanyStatsPanelTitle } from './CompanyStatsPanelTitle'

interface Props<T extends ReportStatus | ReportStatusPro> {
  values: { [key in T]: number } | undefined
  loading?: boolean
  statusDesc: (status: T) => string
  statusShortLabel: (status: T) => string
  statusColor: (status: T) => string
}

export const StatusDistribution = <T extends ReportStatus | ReportStatusPro>({
  values,
  loading,
  statusDesc,
  statusShortLabel,
  statusColor,
}: Props<T>) => {
  const statusDistribution = useMemoFn(values, (_) =>
    objectEntriesUnsafe(_).map(([status, count]) => ({
      label: (
        <span>
          {statusShortLabel(status)}
          <Tooltip title={statusDesc(status)}>
            <Icon
              fontSize="small"
              className="text-gray-500"
              sx={{
                verticalAlign: 'middle',
                ml: 1,
              }}
            >
              help_outline
            </Icon>
          </Tooltip>
        </span>
      ),
      value: count,
      color: statusColor(status) ?? undefined,
    })),
  )

  return (
    <CleanInvisiblePanel loading={loading}>
      <CompanyStatsPanelTitle bottomMargin>
        Répartition des signalements par status
      </CompanyStatsPanelTitle>
      <HorizontalBarChart data={statusDistribution} />
    </CleanInvisiblePanel>
  )
}
