import {Box, Icon} from '@mui/material'
import {ReportSearchResult} from '@signal-conso/signalconso-api-sdk-js'
import {Paginate} from '@alexandreannic/react-hooks-lib/lib'
import {ReportStatusLabel} from '../../shared/ReportStatus/ReportStatus'
import * as React from 'react'
import {useI18n} from '../../core/i18n'
import {IconBtn} from 'mui-extension/lib'
import {siteMap} from '../../core/siteMap'
import {NavLink} from 'react-router-dom'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {ReportDetailValues} from '../../shared/ReportDetailValues/ReportDetailValues'
import {makeSx} from 'mui-extension'

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
      borderBottom: t => `1px solid ${t.palette.divider}`
    }
  },
  reportTag: {
    mb: 1,
    display: 'flex',
    alignItems: 'center',
    color: t => t.palette.text.disabled
  },
  body: {
    flex: 1
  }
})

export const ReportsShortList = ({reports}: Props) => {
  const {m, formatDate} = useI18n()
  return (
    <div>
      {reports.data.map(_ => (
        <Box sx={css.report} key={_.report.id}>
          <Box sx={css.body}>
            <Box>
              <Txt size="big" bold truncate style={{flex: 1, width: 0}}>
                {_.report.category}
              </Txt>
              <Box sx={css.reportTag}>
                <ReportStatusLabel status={_.report.status} dense sx={{mr: 1}} />
                <Txt color="hint">{formatDate(_.report.creationDate)}</Txt>
                <Icon fontSize="inherit" sx={{ml: 1}}>
                  label
                </Icon>
                &nbsp;
                <Txt color="disabled" truncate style={{width: 0, flex: 1}}>
                  {_.report.tags.map(x => m.reportTagDesc[x]).join(', ')}
                </Txt>
              </Box>
            </Box>
            <ReportDetailValues input={_.report.details} lines={3} />
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
