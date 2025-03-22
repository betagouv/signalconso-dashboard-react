import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Badge, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ScOption } from 'core/helper/ScOption'
import { useI18n } from 'core/i18n'
import { Btn } from '../../alexlibs/mui-extension'
import { config } from '../../conf/config'
import { useReportSearchQuery } from '../../core/queryhooks/reportQueryHooks'
import { ScButton } from '../../shared/Button'
import { ExportReportsPopper } from '../../shared/ExportPopperBtn'
import { UseSetState, useSetState } from '../../alexlibs/react-hooks-lib'
import { Id } from '../../core/model'

const ExpandMore = styled((props: { expand: boolean }) => {
  const { expand, ...other } = props
  return <ExpandMoreIcon {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

type SelectReportType = {
  size: number
  clear: () => void
  add: (t: Id | Id[]) => void
  toArray: () => Array<Id>
}

type AdvancedSearchControlsProps = {
  expanded: boolean
  _reports: ReturnType<typeof useReportSearchQuery>
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
  filtersCount: number
  selectReport: SelectReportType
}

export const AdvancedSearchBar: React.FC<AdvancedSearchControlsProps> = ({
  expanded,
  _reports,
  setExpanded,
  filtersCount,
  selectReport,
}) => {
  const { m } = useI18n()
  return (
    <Box
      sx={{
        flexWrap: 'wrap',
        whiteSpace: 'nowrap',
        mt: 2,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <ScButton onClick={(_) => setExpanded((prev) => !prev)}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>Recherche avancée&nbsp;</span>
          <ExpandMore expand={expanded} />
        </span>
      </ScButton>

      <span className="flex flex-wrap items-center justify-end whitespace-nowrap gap-2">
        {filtersCount !== 0 && (
          <Badge
            color="error"
            badgeContent={filtersCount}
            hidden={filtersCount === 0}
          >
            <ScButton
              icon="clear"
              onClick={_reports.clearFilters}
              variant="outlined"
              color="primary"
            >
              {m.removeAllFilters}
            </ScButton>
          </Badge>
        )}
        <ExportReportsPopper
          disabled={ScOption.from(_reports?.result.data?.totalCount)
            .map((_) => _ > config.reportsLimitForExport)
            .getOrElse(false)}
          tooltipBtnNew={ScOption.from(_reports?.result.data?.totalCount)
            .map((_) =>
              _ > config.reportsLimitForExport
                ? m.cannotExportMoreReports(config.reportsLimitForExport)
                : '',
            )
            .getOrElse('')}
          filters={_reports.filters}
        >
          <Btn
            disabled={selectReport.size != 0}
            variant="outlined"
            color="primary"
            icon="get_app"
          >
            {m.exportInXLS}
          </Btn>
        </ExportReportsPopper>
        <Btn
          variant="outlined"
          color="primary"
          icon="get_app"
          disabled={selectReport.size != 0}
          onClick={(_) =>
            selectReport.add(
              _reports.result.data!.entities!.map((_) => _.report.id),
            )
          }
        >
          Exporter en PDF
        </Btn>
      </span>
    </Box>
  )
}
