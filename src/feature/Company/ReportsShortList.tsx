import {Box, Icon} from '@mui/material'
import {ReportStatusLabel} from '../../shared/ReportStatus'
import * as React from 'react'
import {useI18n} from '../../core/i18n'
import {IconBtn} from '../../alexlibs/mui-extension'
import {siteMap} from '../../core/siteMap'
import {NavLink} from 'react-router-dom'
import {Txt} from '../../alexlibs/mui-extension'
import {ReportDetailValues} from '../../shared/ReportDetailValues'
import {makeSx} from '../../alexlibs/mui-extension'
import {styleUtils} from '../../core/theme'
import {ReportSearchResult} from '../../core/client/report/Report'
import {Paginate, PaginatedFilters, ReportSearch} from '../../core/model'
import {UseQueryPaginateResult} from 'core/queryhooks/UseQueryPaginate'
import {CleanDiscreetPanel} from 'shared/Panel/simplePanels'

interface Props {
  reports: Paginate<ReportSearchResult>
}

const css = makeSx({
  report: {
    display: 'flex',
    alignItems: 'center',
    pb: 2,
    m: 2,
    '&:not(:last-of-type)': {
      borderBottom: t => `1px solid ${t.palette.divider}`,
    },
  },
  reportTag: {
    mb: 1,
    display: 'flex',
    alignItems: 'center',
    color: t => t.palette.text.disabled,
  },
  body: {
    flex: 1,
  },
})

const ReportsShortList = ({reports}: Props) => {
  const {m, formatDate} = useI18n()
  return (
    <div>
      {reports.entities.map(_ => (
        <Box sx={css.report} key={_.report.id}>
          <Box sx={css.body}>
            <Box>
              <Txt size="big" bold block truncate sx={{flex: 1, mb: 0.5}}>
                {m.ReportCategoryDesc[_.report.category]}
              </Txt>
              <Box sx={css.reportTag}>
                <ReportStatusLabel status={_.report.status} dense sx={{mr: 1}} />
                <Txt color="hint">{formatDate(_.report.creationDate)}</Txt>
                <Icon fontSize="inherit" sx={{ml: 1}}>
                  label
                </Icon>
                &nbsp;
                {_.report.tags && _.report.tags.length > 0 && (
                  <Txt color="disabled" truncate style={{width: 0, flex: 1}}>
                    {_.report.tags.map(x => m.reportTagDesc[x]).join(', ')}
                  </Txt>
                )}
              </Box>
            </Box>
            <ReportDetailValues input={_.report.details} lines={3} sx={{fontSize: t => styleUtils(t).fontSize.normal}} />
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
  _reports: UseQueryPaginateResult<ReportSearch & PaginatedFilters, Paginate<ReportSearchResult>, unknown>
}) {
  const {m} = useI18n()

  return (
    <CleanDiscreetPanel loading={_reports.result.isFetching}>
      <h2 className="font-bold text-lg">{m.lastReports}</h2>
      {_reports.result.data && <ReportsShortList reports={_reports.result.data} />}
    </CleanDiscreetPanel>
  )
}
