import {PanelBody} from '../../shared/Panel'
import React from 'react'
import {useI18n} from '../../core/i18n'

import {Box, BoxProps, Icon} from '@mui/material'
import {styleUtils, sxUtils} from '../../core/theme'
import {ReportFiles} from './File/ReportFiles'
import {useReportContext} from '../../core/context/ReportContext'
import {Txt} from '../../alexlibs/mui-extension'
import {Divider} from '../../shared/Divider'
import {
  Event,
  EventActionValues,
  ReportResponse,
  ReportResponseTypes,
  ResponseConsumerReview,
  ResponseEvaluation,
} from '../../core/client/event/Event'
import {FileOrigin, UploadedFile} from '../../core/client/file/UploadedFile'
import {Id, Report} from '../../core/model'
import {fnSwitch} from '../../core/helper'
import {useLogin} from '../../core/context/LoginContext'
import {ScOption} from 'core/helper/ScOption'
import {GetReportEventsQueryKeys} from '../../core/queryhooks/eventQueryHooks'
import {useQueryClient} from '@tanstack/react-query'
import {ReportFileDeleteButton} from './File/ReportFileDownloadAllButton'

interface Props {
  canEditFile?: boolean
  response?: Event
  consumerReportReview?: ResponseConsumerReview
  report: Report
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
export const ReportResponseComponent = ({canEditFile, response, consumerReportReview, report, files}: Props) => {
  const {m} = useI18n()
  const queryClient = useQueryClient()
  const _report = useReportContext()
  const {connectedUser} = useLogin()

  return (
    <PanelBody>
      {ScOption.from(response?.details as ReportResponse)
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
            <Box sx={{color: t => t.palette.text.disabled}}>{(response?.details as ReportResponse).consumerDetails}</Box>

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
        .getOrElse(<div className="mt-2">{m.noAnswerFromPro}</div>)}
      <div className="flex flex-row mt-5 ">
        <Txt gutterBottom bold size="big" block>
          {m.attachedFiles}
        </Txt>
        {files && files.length > 0 && <ReportFileDeleteButton report={report} fileOrigin={FileOrigin.Professional} />}
      </div>
      <ReportFiles
        hideAddBtn={!canEditFile}
        reportId={report.id}
        files={files}
        fileOrigin={FileOrigin.Professional}
        onNewFile={file => {
          _report.postAction
            .fetch({}, report.id, {
              details: '',
              fileIds: [file.id],
              actionType: EventActionValues.ProfessionalAttachments,
            })
            .then(() => queryClient.invalidateQueries({queryKey: GetReportEventsQueryKeys(report.id)}))
        }}
      />
      <Divider margin />
      {ScOption.from(consumerReportReview)
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
            {connectedUser.isNotPro && (
              <Box sx={{color: t => t.palette.text.secondary}}>
                {' '}
                {review.details ? review.details : <div>{m.noReviewDetailsFromConsumer}</div>}
              </Box>
            )}
          </div>
        ))
        .getOrElse(<Box sx={{mt: 3}}>{m.noReviewFromConsumer}</Box>)}
    </PanelBody>
  )
}
