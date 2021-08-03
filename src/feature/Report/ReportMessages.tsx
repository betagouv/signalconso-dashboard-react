import {PanelBody, PanelTitle} from '../../shared/Panel'
import React, {useEffect, useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {EventActionValues, FileOrigin, Id, ReportEvent, ReportResponse, ReportResponseTypes, UploadedFile} from '../../core/api'
import {classes, fnSwitch} from '../../core/helper/utils'
import {fromNullable} from 'fp-ts/lib/Option'
import {Icon, makeStyles, Theme} from '@material-ui/core'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {utilsStyles} from '../../core/theme'
import {ReportFiles} from './File/ReportFiles'

interface Props {
  events: ReportEvent[]
  reportId: Id
  files?: UploadedFile[]
}

const useStyles = makeStyles((t: Theme) => ({
  responseType: {
    fontSize: utilsStyles(t).fontSize.big,
    display: 'flex',
    alignItems: 'center',
    marginBottom: t.spacing(1),
  }
}))

export const ReportMessages = ({events, reportId, files}: Props) => {
  const {m} = useI18n()
  const response = useMemo(() => events.find(_ => _.data.action === EventActionValues.ReportProResponse), [events])
  const cssUtils = useCssUtils()
  const css = useStyles()

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
          <div className={cssUtils.colorTxtSecondary}>
            {(response?.data.details as ReportResponse).consumerDetails}
          </div>

          {details.dgccrfDetails && details.dgccrfDetails !== '' && (
            <>
              <PanelTitle>{m.reportDgccrfDetails}</PanelTitle>
              <div className={cssUtils.colorTxtSecondary}>{details.dgccrfDetails}</div>
            </>
          )}
        </div>
      )).getOrElse(
        <div>{m.noAnswerFromPro}</div>)
      }
      <PanelTitle>{m.attachedFiles}</PanelTitle>
      <ReportFiles reportId={reportId} files={files} fileOrigin={FileOrigin.Professional}/>
    </PanelBody>
  )
}
