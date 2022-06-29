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
import {fnSwitch} from '../../core/helper/utils'
import {fromNullable} from 'fp-ts/lib/Option'
import {Box, BoxProps, Icon} from '@mui/material'
import {styleUtils, sxUtils} from '../../core/theme'
import {ReportFiles} from './File/ReportFiles'
import {useReportContext} from '../../core/context/ReportContext'
import {Txt} from '../../alexlibs/mui-extension'
import {useEventContext} from '../../core/context/EventContext'
import {ResponseEvaluation} from '@signal-conso/signalconso-api-sdk-js/lib/client/event/Event'
import {Divider} from '../../shared/Divider/Divider'

interface Props {
  canEditFile?: boolean
  response?: ReportEvent
  reportId: Id
  files?: UploadedFile[]
}

const Response = ({
  icon,
  children,
  sx,
  ...props
}: {
  icon: string
} & BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        fontSize: t => styleUtils(t).fontSize.big,
        display: 'inline-flex',
        alignItems: 'center',
        mb: 1,
        borderRadius: 40,
        border: t => '1px solid ' + t.palette.divider,
        py: 0.5,
        px: 1,
        ...sx,
      }}
    >
      <Icon sx={{mr: 1, ...sxUtils.inlineIcon}}>{icon}</Icon>
      {children}
    </Box>
  )
}
export const ReportResponseComponent = ({canEditFile, response, reportId, files}: Props) => {
  const {m} = useI18n()
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
              [ReportResponseTypes.Accepted]: _ => <Response icon="check_circle">{m.reportResponse[_]}</Response>,
              [ReportResponseTypes.NotConcerned]: _ => (
                <Response icon="hide_source" sx={{color: t => t.palette.info.main}}>
                  {m.reportResponse[_]}
                </Response>
              ),
              [ReportResponseTypes.Rejected]: _ => (
                <Response icon="cancel" sx={{color: t => t.palette.error.main}}>
                  {m.reportResponse[_]}
                </Response>
              ),
            })}
            <Box sx={{color: t => t.palette.text.disabled}}>{(response?.data.details as ReportResponse).consumerDetails}</Box>

            {details.dgccrfDetails && details.dgccrfDetails !== '' && (
              <>
                <Txt sx={{mt: 2}} bold size="big" block>
                  {m.reportDgccrfDetails}
                </Txt>
                <Box sx={{color: t => t.palette.text.disabled}}>{details.dgccrfDetails}</Box>
              </>
            )}
          </div>
        ))
        .getOrElse(<div>{m.noAnswerFromPro}</div>)}
      <Txt sx={{mt: 2}} gutterBottom bold size="big" block>
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
      <Divider margin />
      {fromNullable(consumerReportReview)
        .map(review => (
          <div>
            {fnSwitch(review.evaluation, {
              [ResponseEvaluation.Positive]: _ => (
                <Response icon="check_circle" sx={{color: t => t.palette.success.light}}>
                  {m.responseEvaluation[_]}
                </Response>
              ),
              [ResponseEvaluation.Neutral]: _ => (
                <Response icon="hide_source" sx={{color: t => t.palette.info.light}}>
                  {m.responseEvaluation[_]}
                </Response>
              ),
              [ResponseEvaluation.Negative]: _ => (
                <Response icon="cancel" sx={{color: t => t.palette.error.light}}>
                  {m.responseEvaluation[_]}
                </Response>
              ),
            })}
            <Box sx={{color: t => t.palette.text.secondary}}>
              {' '}
              {review.details ? review.details : <div>{m.noReviewDetailsFromConsumer}</div>}
            </Box>
          </div>
        ))
        .getOrElse(<Box sx={{mt: 3}}>{m.noReviewFromConsumer}</Box>)}
    </PanelBody>
  )
}
