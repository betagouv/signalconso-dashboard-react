import {ReportEvent} from '@signal-conso/signalconso-api-sdk-js'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {ReportEventIcon} from './ReportEventIcon'
import {useCssUtils} from '../../../core/helper/useCssUtils'
import {classes} from '../../../core/helper/utils'
import {Icon, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {styleUtils} from '../../../core/theme'

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
      },
    },
  },
  body: {
    flex: 1,
    padding: styleUtils(t).spacing(0, 2, 1.5, 0),
    fontSize: styleUtils(t).fontSize.small,
    borderBottom: '1px solid ' + t.palette.divider,
  },
  icon: {
    margin: styleUtils(t).spacing(0, 2, 2, 0),
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: t.typography.fontWeightBold,
    fontSize: styleUtils(t).fontSize.normal,
  },
  date: {
    whiteSpace: 'nowrap',
    color: t.palette.text.disabled,
    marginTop: t.spacing(0.5),
  },
}))

export const ReportEventComponent = ({event}: ReportComponentEventProps) => {
  const {m, formatDate, formatDateTime} = useI18n()
  const cssUtils = useCssUtils()
  const css = useStyles()

  return (
    <div className={css.root} key={event.data.id}>
      <ReportEventIcon className={css.icon} action={event.data.action} />
      <div className={css.body}>
        <div className={css.head}>
          <div className={css.title}>{event.data.action}</div>
          <div className={css.date}>{formatDateTime(event.data.creationDate)}</div>
        </div>

        {event.user && (
          <div>
            <Icon className={classes(cssUtils.inlineIcon, cssUtils.colorTxtSecondary)}>person</Icon>
            &nbsp;
            {event.user.firstName} {event.user.lastName} {event.user.role}
          </div>
        )}
        <div className={cssUtils.colorTxtSecondary}>{(event.data.details as any)?.description}</div>
      </div>
    </div>
  )
}
