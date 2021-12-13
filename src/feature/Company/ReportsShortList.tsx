import { Icon, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {ReportSearchResult} from '@signal-conso/signalconso-api-sdk-js'
import {Paginate} from '@alexandreannic/react-hooks-lib/lib'
import {ReportStatusLabel} from '../../shared/ReportStatus/ReportStatus'
import * as React from 'react'
import {useI18n} from '../../core/i18n'
import {IconBtn} from 'mui-extension/lib'
import {siteMap} from '../../core/siteMap'
import {NavLink} from 'react-router-dom'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {ReportDetailValues} from '../../shared/ReportDetailValues/ReportDetailValues'
import {useLogin} from '../../core/context/LoginContext'

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
    color: t.palette.text.disabled,
  },
  body: {
    flex: 1,
  },
  title: {},
}))

export const ReportsShortList = ({reports}: Props) => {
  const css = useStyles()
  const cssUtils = useCssUtils()
  const {formatDate} = useI18n()
  return (
    <div>
      {reports.data.map(_ => (
        <div className={css.report} key={_.report.id}>
          <div className={css.body}>
            <div className={css.title}>
              <Txt size="big" bold truncate style={{flex: 1, width: 0}}>
                {_.report.category}
              </Txt>
              <div className={css.reportTag}>
                <ReportStatusLabel status={_.report.status} dense className={cssUtils.marginRight} />
                <Txt color="hint">{formatDate(_.report.creationDate)}</Txt>
                <Icon fontSize="inherit" className={cssUtils.marginLeft}>
                  label
                </Icon>
                &nbsp;
                <Txt color="disabled" truncate style={{width: 0, flex: 1}}>
                  {_.report.tags.join(', ')}
                </Txt>
              </div>
            </div>
            <ReportDetailValues input={_.report.details} lines={3} />
          </div>
          <NavLink to={siteMap.logged.report(_.report.id)}>
            <IconBtn color="primary">
              <Icon>chevron_right</Icon>
            </IconBtn>
          </NavLink>
        </div>
      ))}
    </div>
  )
}
