import {PanelBody} from '../../shared/Panel'
import React, {useEffect, useMemo} from 'react'
import {useReportContext} from '../../core/context/ReportContext'
import {useI18n} from '../../core/i18n'
import {EventActionValues, ReportEvent, ReportResponse, ReportResponseTypes} from '../../core/api'
import {classes, fnSwitch} from '../../core/helper/utils'
import {fromNullable} from 'fp-ts/lib/Option'
import {Icon, makeStyles, Theme} from '@material-ui/core'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {utilsStyles} from '../../core/theme'

interface Props {
  events: ReportEvent[]
}

const useStyles = makeStyles((t: Theme) => ({
  responseType: {
    fontSize: utilsStyles(t).fontSize.big,
    display: 'flex',
    alignItems: 'center',
    marginBottom: t.spacing(1),
  }
}))

export const ReportMessages = ({events}: Props) => {
  const _report = useReportContext()
  const {m} = useI18n()
  const response = useMemo(() => events.find(_ => _.data.action === EventActionValues.ReportResponse), [events])
  const cssUtils = useUtilsCss()
  const css = useStyles()
  console.log(events, response)

  useEffect(() => {
  }, [])

  return (
    <PanelBody>
      {fromNullable(response?.data.details as ReportResponse).map((details) => (
        <div>
          {fnSwitch(details.responseType, {
            [ReportResponseTypes.Accepted]: _ => (
              <div className={classes(css.responseType, cssUtils.colorSuccess)}>
                <Icon className={classes(cssUtils.marginRight, cssUtils.inlineIcon)}>check_circle</Icon>
                {m.reportResponse[_]}
              </div>
            ),
            [ReportResponseTypes.NotConcerned]: _ => (
              <div className={classes(css.responseType, cssUtils.colorInfo)}>
                <Icon className={classes(cssUtils.marginRight, cssUtils.inlineIcon)}>hide_source</Icon>
                {m.reportResponse[_]}
              </div>
            ),
            [ReportResponseTypes.Rejected]: _ => (
              <div className={classes(css.responseType, cssUtils.colorError)}>
                <Icon className={classes(cssUtils.marginRight, cssUtils.inlineIcon)}>cancel</Icon>
                {m.reportResponse[_]}
              </div>
            ),
          })}
          {(response?.data.details as ReportResponse).consumerDetails}
          {(response?.data.details as ReportResponse).dgccrfDetails}
          {(response?.data.details as ReportResponse).fileIds}
        </div>
      )).toUndefined()}
    </PanelBody>
  )
}
