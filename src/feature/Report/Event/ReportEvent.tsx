import {ReportEvent} from 'core/api'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {ReportEventIcon} from './ReportEventIcon'
import {useCssUtils} from '../../../core/helper/useCssUtils'
import {classes} from '../../../core/helper/utils'
import {Icon, makeStyles, Theme} from '@material-ui/core'
import {utilsStyles} from '../../../core/theme'

export interface ReportComponentEventProps {
  event: ReportEvent
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'flex',
    marginBottom: t.spacing(1.5),
    '&:last-of-type': {
      marginBottom: 0,
      '& $body': {
        border: 'none',
        paddingBottom: 0,
      }
    }
  },
  body: {
    flex: 1,
    padding: utilsStyles(t).spacing(0, 2, 1.5, 0),
    fontSize: utilsStyles(t).fontSize.small,
    borderBottom: '1px solid ' + t.palette.divider,
  },
  icon: {
    margin: utilsStyles(t).spacing(0, 2, 2, 0),
  },
  title: {
    fontWeight: t.typography.fontWeightBold,
    fontSize: utilsStyles(t).fontSize.normal,
  },
  date: {
    color: t.palette.text.hint,
    marginTop: t.spacing(.5),
  }
}))

export const ReportEventComponent = ({event}: ReportComponentEventProps) => {
  const {m, formatDate, formatDateTime} = useI18n()
  const cssUtils = useCssUtils()
  const css = useStyles()

  return (
    <div className={css.root} key={event.data.id}>
      <ReportEventIcon className={css.icon} action={event.data.action}/>
      <div className={css.body}>
        <div className={css.title}>
          {event.data.action}
        </div>

        {event.user && (
          <div>
            <Icon className={classes(cssUtils.inlineIcon, cssUtils.colorTxtSecondary)}>person</Icon>
            &nbsp;
            {event.user.firstName} {event.user.lastName} {event.user.role}
          </div>
        )}
        <div className={cssUtils.colorTxtSecondary}>
          {(event.data.details as any)?.description}
        </div>
        <div className={css.date}>
          {formatDateTime(event.data.creationDate)}
        </div>
      </div>
    </div>
  )
}
