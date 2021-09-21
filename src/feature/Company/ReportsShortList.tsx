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
    paddingBottom: t.spacing(2),
    margin: t.spacing(2, 2, 2, 2),
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${t.palette.divider}`,
    },
  },
  reportTag: {
    marginBottom: t.spacing(1),
    display: 'flex',
    alignItems: 'center',
    color: t.palette.text.hint,
  },
  body: {
    flex: 1,
  },
  title: {
    justifyContent: 'flex-between',
    display: 'flex',
    alignItems: 'center',
  }
}))

export const ReportsShortList = ({reports}: Props) => {
  const css = useStyles()
  const {formatDate} = useI18n()
  return (
    <div>
      {reports.data.map(_ => (
        <div className={css.report}>
          <div className={css.body}>
            <div className={css.title}>
              <Txt size="big" bold truncate style={{flex: 1}}>{_.report.category}</Txt>
              &nbsp;
              <Txt color="hint">{formatDate(_.report.creationDate)}</Txt>
            </div>
            <div className={css.reportTag}>
              <Icon fontSize="inherit">label</Icon>
              <Txt size="small">{_.report.tags.join(', ')}</Txt>
            </div>
            <ReportStatusChip status={_.report.status} dense/>
          </div>
          <NavLink to={siteMap.report(_.report.id)}>
            <IconBtn>
              <Icon>chevron_right</Icon>
            </IconBtn>
          </NavLink>
        </div>
      ))}
    </div>
  )
}
