import {ReportEvent} from '@signalconso/signalconso-api-sdk-js/build'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {ReportEventIcon} from './ReportEventIcon'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {classes} from '../../core/helper/utils'
import {makeStyles, Theme} from '@material-ui/core'
import {utilsStyles} from '../../core/theme'

export interface ReportComponentEventProps {
  event: ReportEvent
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    padding: utilsStyles(t).padding(2, 0, 2, 0),
    marginBottom: t.spacing(2),
    '&:not(:last-of-type)': {
      borderBottom: '1px solid ' + t.palette.divider,
    }
  }
}))

export const ReportEventComponent = ({event}: ReportComponentEventProps) => {
  const {m, formatDate, formatDateTime} = useI18n()
  const cssUtils = useUtilsCss()
  const css = useStyles()

  return (
    <div className={css.root} key={event.data.id}>
      <ReportEventIcon action={event.data.action}/>
      <div>
        <div className={classes(cssUtils.txtBig, cssUtils.txtBold, cssUtils.marginBottom)}>
          {event.data.action}
        </div>

        {event.user && (
          <div className={cssUtils.colorTxtHint}>
            {event.user.firstName} {event.user.lastName} {event.user.role}
          </div>
        )}
        <div className={cssUtils.colorTxtSecondary}>
          {(event.data.details as any)?.description}
        </div>
        <div className={classes(cssUtils.colorTxtHint, cssUtils.marginTop)}>
          {formatDateTime(event.data.creationDate)}
        </div>
      </div>
    </div>
  )
}
