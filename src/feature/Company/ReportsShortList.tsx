import { Box, Icon } from '@mui/material'
import { UseQueryPaginateResult } from 'core/queryhooks/UseQueryPaginate'
import { NavLink } from 'react-router-dom'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { IconBtn, Txt, makeSx } from '../../alexlibs/mui-extension'
import { ReportSearchResult } from '../../core/client/report/Report'
import { useI18n } from '../../core/i18n'
import { Paginate, PaginatedFilters, ReportSearch } from '../../core/model'
import { siteMap } from '../../core/siteMap'
import { styleUtils } from '../../core/theme'
import { ReportDetailValues } from '../../shared/ReportDetailValues'
import { ReportStatusLabel } from '../../shared/ReportStatus'

interface Props {
  reports: Paginate<ReportSearchResult>
}

const css = makeSx({
  report: {
    display: 'flex',
    alignItems: 'center',
    pb: 2,
    my: 2,
    '&:not(:last-of-type)': {
      borderBottom: (t) => `1px solid ${t.palette.divider}`,
    },
  },
  reportTag: {
    mb: 1,
    display: 'flex',
    alignItems: 'center',
    color: (t) => t.palette.text.disabled,
  },
  body: {
    flex: 1,
  },
})

const ReportsShortList = ({ reports }: Props) => {
  const { m, formatDate } = useI18n()
  return (
    <div>
      {reports.entities.map((_) => (
        <Box sx={css.report} key={_.report.id}>
          <Box sx={css.body}>
            <Box>
              <span className="italic">
                {m.ReportCategoryDesc[_.report.category]}
              </span>
              <Box sx={css.reportTag}>
                <ReportStatusLabel
                  status={_.report.status}
                  dense
                  sx={{ mr: 1 }}
                />
                <Txt color="hint">{formatDate(_.report.creationDate)}</Txt>
                <Icon fontSize="inherit" sx={{ ml: 1 }}>
                  label
                </Icon>
                &nbsp;
                {_.report.tags && _.report.tags.length > 0 && (
                  <Txt color="disabled" truncate style={{ width: 0, flex: 1 }}>
                    {_.report.tags.map((x) => m.reportTagDesc[x]).join(', ')}
                  </Txt>
                )}
              </Box>
            </Box>
            <ReportDetailValues
              input={_.report.details}
              lines={3}
              sx={{ fontSize: (t) => styleUtils(t).fontSize.normal }}
            />
          </Box>
          <NavLink to={siteMap.logged.report(_.report.id)}>
            <IconBtn color="primary">
              <Icon>chevron_right</Icon>
            </IconBtn>
          </NavLink>
        </Box>
      ))}
    </div>
  )
}

export function ReportsShortListPanel({
  _reports,
}: {
  _reports: UseQueryPaginateResult<
    ReportSearch & PaginatedFilters,
    Paginate<ReportSearchResult>,
    unknown
  >
}) {
  const { m } = useI18n()

  return (
    <CleanInvisiblePanel loading={_reports.result.isFetching}>
      <h2 className="font-bold text-2xl">{m.lastReports}</h2>
      {_reports.result.data && (
        <ReportsShortList reports={_reports.result.data} />
      )}
    </CleanInvisiblePanel>
  )
}
