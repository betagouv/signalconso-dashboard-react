import {Icon, makeStyles, Theme} from '@material-ui/core'
import {ReportSearchResult} from '../../core/api'
import {Paginate} from '@alexandreannic/react-hooks-lib/lib'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import * as React from 'react'
import {useI18n} from '../../core/i18n'
import {IconBtn} from 'mui-extension/lib'
import {siteMap} from '../../core/siteMap'
import {NavLink} from 'react-router-dom'
import {Txt} from 'mui-extension/lib/Txt/Txt'

interface Props {
  reports: Paginate<ReportSearchResult>
}

const useStyles = makeStyles((t: Theme) => ({
  report: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-between',
    margin: t.spacing(2, 2, 2, 2),
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${t.palette.divider}`,
    },
  },
  reportTag: {
    display: 'block',
    alignItems: 'center',
    color: t.palette.text.hint,
  },
}))

export const ReportsShortList = ({reports}: Props) => {
  const css = useStyles()
  const {formatDate} = useI18n()
  return (
    <div>
      {reports.data.map(_ => (
        <div className={css.report}>
          <div>
            <Txt size="big" bold truncate>{_.report.category}</Txt>
            <ReportStatusChip status={_.report.status} dense/>
            &nbsp;
            <Txt color="hint">{formatDate(_.report.creationDate)}</Txt>
            <div className={css.reportTag}>
              <Icon fontSize="inherit">label</Icon>
              <Txt size="small">{_.report.tags.join(', ')}</Txt>
            </div>
          </div>
          <NavLink to={siteMap.reports({siretSirenList: [_.report.companySiret]})}>
            <IconBtn>
              <Icon>chevron_right</Icon>
            </IconBtn>
          </NavLink>
        </div>
      ))}
    </div>
  )
}
