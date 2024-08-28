import { Icon, Tooltip } from '@mui/material'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'
import { useMemoFn } from '../../../alexlibs/react-hooks-lib'
import { Enum } from '../../../alexlibs/ts-utils'
import {
  ReportStatus,
  ReportStatusPro,
} from '../../../core/client/report/Report'
import { useI18n } from '../../../core/i18n'
import { HorizontalBarChart } from '../../../shared/Chart/HorizontalBarChart'
import { PanelBody } from '../../../shared/Panel'

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
  const { m } = useI18n()

  const statusDistribution = useMemoFn(values, (_) =>
    Enum.entries(_).map(([status, count]) => ({
      label: (
        <span>
          {statusShortLabel(status)}
          <Tooltip title={statusDesc(status)}>
            <Icon
              fontSize="small"
              sx={{
                verticalAlign: 'middle',
                color: (t) => t.palette.text.disabled,
                ml: 1,
              }}
            >
              help
            </Icon>
          </Tooltip>
        </span>
      ),
      value: count,
      color: statusColor(status) ?? undefined,
    })),
  )

  return (
    <CleanDiscreetPanel loading={loading}>
      <h2 className="font-bold text-lg">
        Répartition des signalements par status
      </h2>
      <PanelBody>
        <HorizontalBarChart data={statusDistribution} grid />
      </PanelBody>
    </CleanDiscreetPanel>
  )
}
