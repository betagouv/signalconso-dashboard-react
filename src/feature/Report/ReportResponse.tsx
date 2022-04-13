import {PanelBody} from '../../shared/Panel'
import React, {useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {
  EventActionValues,
  FileOrigin,
  Id,
  ReportEvent,
  ReportResponse,
  ReportResponseTypes,
  ResponseConsumerReview,
  UploadedFile,
} from '@signal-conso/signalconso-api-sdk-js'
import {classes, fnSwitch} from '../../core/helper/utils'
import {fromNullable} from 'fp-ts/lib/Option'
import {Divider, Icon, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {styleUtils} from '../../core/theme'
import {ReportFiles} from './File/ReportFiles'
import {useReportContext} from '../../core/context/ReportContext'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useEventContext} from '../../core/context/EventContext'
import {Emoticon} from "../../shared/Emoticon/Emoticon";
import {ResponseEvaluation} from "@signal-conso/signalconso-api-sdk-js/lib/client/event/Event";

interface Props {
  canEditFile?: boolean
  response?: ReportEvent
  reportId: Id
  files?: UploadedFile[]
}

const useStyles = makeStyles((t: Theme) => ({
  responseType: {
    fontSize: styleUtils(t).fontSize.big,
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: t.spacing(1),
    borderRadius: 40,
    border: '1px solid ' + t.palette.divider,
    padding: t.spacing(0.5, 1, 0.5, 1),
  },
}))

export const ReportResponseComponent = ({canEditFile, response, reportId, files}: Props) => {
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const css = useStyles()
  const _report = useReportContext()
  const _event = useEventContext()
  const [consumerReportReview, setConsumerReportReview] = useState<ResponseConsumerReview | undefined>()

  useEffect(() => {
    _report.getReviewOnReportResponse.fetch({}, reportId).then(setConsumerReportReview)
  }, [])

  return (
    <PanelBody>
      {fromNullable(response?.data.details as ReportResponse)
        .map(details => (
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
            <div className={cssUtils.colorTxtSecondary}>{(response?.data.details as ReportResponse).consumerDetails}</div>

            {details.dgccrfDetails && details.dgccrfDetails !== '' && (
              <>
                <Txt className={cssUtils.marginTop2} bold size="big" block>
                  {m.reportDgccrfDetails}
                </Txt>
                <div className={cssUtils.colorTxtSecondary}>{details.dgccrfDetails}</div>
              </>
            )}
          </div>
        ))
        .getOrElse(<div>{m.noAnswerFromPro}</div>)}
      <Txt className={cssUtils.marginTop2} gutterBottom bold size="big" block>
        {m.attachedFiles}
      </Txt>
      <ReportFiles
        hideAddBtn={!canEditFile}
        reportId={reportId}
        files={files}
        fileOrigin={FileOrigin.Professional}
        onNewFile={file => {
          _report.postAction
            .fetch({}, reportId, {
              details: '',
              fileIds: [file.id],
              actionType: EventActionValues.ProfessionalAttachments,
            })
            .then(() => _event.reportEvents.fetch({force: true, clean: false}, reportId))
        }}
      />
      <Divider className={cssUtils.divider}/>
      {fromNullable(consumerReportReview).map( review =>
        <div>
          {fnSwitch(review.evaluation, {
            [ResponseEvaluation.Positive]: _ => (
              <div className={classes(css.responseType, cssUtils.colorSuccess)}>
                <Icon className={classes(cssUtils.marginRight, cssUtils.inlineIcon)}>check_circle</Icon>
                {m.responseEvaluation[_]}
              </div>
            ),
            [ResponseEvaluation.Neutral]: _ => (
              <div className={classes(css.responseType, cssUtils.colorInfo)}>
                <Icon className={classes(cssUtils.marginRight, cssUtils.inlineIcon)}>hide_source</Icon>
                {m.responseEvaluation[_]}
              </div>
            ),
            [ResponseEvaluation.Negative]: _ => (
              <div className={classes(css.responseType, cssUtils.colorError)}>
                <Icon className={classes(cssUtils.marginRight, cssUtils.inlineIcon)}>cancel</Icon>
                {m.responseEvaluation[_]}
              </div>
            ),
          })}
        <div className={cssUtils.colorTxtSecondary}> {review.details ? review.details : <div>{m.noReviewDetailsFromConsumer}</div>}</div>
        </div>).getOrElse(<div className={cssUtils.marginTop3}>{m.noReviewFromConsumer}</div>)
      }
    </PanelBody>
  )
}
