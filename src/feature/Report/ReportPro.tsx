import {useParams} from 'react-router'
import {useI18n} from '../../core/i18n'
import React, {useMemo, useRef} from 'react'
import {Page} from '../../shared/Page'
import {ReportHeader} from './ReportHeader'
import {useBoolean} from '../../alexlibs/react-hooks-lib'
import {Box, Collapse} from '@mui/material'
import {ScButton} from '../../shared/Button'
import {styleUtils} from '../../core/theme'
import {Txt} from '../../alexlibs/mui-extension'
import {ReportDescription} from './ReportDescription'
import {ReportResponseForm} from './ReportResponseForm/ReportResponseForm'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ReportResponseComponent} from './ReportResponse'
import {ReportEvents} from './Event/ReportEvents'
import {creationReportEvent} from './Report'
import {EventActionValues} from '../../core/client/event/Event'
import {FileOrigin} from '../../core/client/file/UploadedFile'
import {Influencer, Report} from '../../core/client/report/Report'
import {Id} from '../../core/model'
import {capitalize} from '../../core/helper'
import {ReportReferenceNumber} from 'feature/Report/ReportReferenceNumber'
import {ScOption} from 'core/helper/ScOption'
import {ReportInfluencer} from './ReportInfluencer'
import {GetReportQueryKeys, useGetReportQuery, useGetReviewOnReportResponseQuery} from '../../core/queryhooks/reportQueryHooks'
import {GetReportEventsQueryKeys, useGetReportEventsQuery} from '../../core/queryhooks/eventQueryHooks'
import {useQueryClient} from '@tanstack/react-query'

export const ReportPro = () => {
  const {id} = useParams<{id: Id}>()
  const {m, formatDateTime} = useI18n()
  const queryClient = useQueryClient()
  const _getReport = useGetReportQuery(id)
  const reportEvents = useGetReportEventsQuery(id)
  const _getReviewOnReportResponse = useGetReviewOnReportResponseQuery(id, {enabled: !!_getReport.data?.report.id})
  const openAnswerPanel = useBoolean(false)
  const response = useMemo(
    () => reportEvents.data?.find(_ => _.data.action === EventActionValues.ReportProResponse),
    [reportEvents.data],
  )
  const responseFormRef = useRef<any>(null)

  const openResponsePanel = () => {
    openAnswerPanel.setTrue()
    setTimeout(() => {
      if (responseFormRef.current) {
        responseFormRef.current.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'})
      }
    }, 200)
  }

  return (
    <Page maxWidth="s" loading={_getReport.isLoading}>
      {ScOption.from(_getReport.data?.report)
        .map(report => (
          <>
            <ReportHeader isUserPro elevated={!openAnswerPanel.value} report={report}>
              {!response && !Report.isClosed(report.status) && (
                <ScButton
                  style={{marginLeft: 'auto'}}
                  onClick={openResponsePanel}
                  icon="priority_high"
                  color="error"
                  variant="contained"
                >
                  {m.answer}
                </ScButton>
              )}
            </ReportHeader>
            {report.influencer && <ReportInfluencerPanel influencer={report.influencer} />}
            <ReportDescription report={report} files={_getReport.data?.files}>
              <Txt block bold>
                {m.consumer}
              </Txt>
              {report.contactAgreement ? (
                <>
                  <Box sx={{color: t => t.palette.text.secondary}}>
                    {ScOption.from(report.firstName)
                      .map(_ => capitalize(_))
                      .getOrElse('')}
                    &nbsp;
                    {ScOption.from(report.lastName)
                      .map(_ => _.toLocaleUpperCase())
                      .getOrElse('')}
                  </Box>
                  <Txt color="hint">{report.email}</Txt>
                  <ReportReferenceNumber consumerReferenceNumber={report.consumerReferenceNumber} />
                </>
              ) : (
                <Txt color="hint">{m.reportConsumerWantToBeAnonymous}</Txt>
              )}
            </ReportDescription>

            <Collapse in={reportEvents.data && !!response}>
              <Panel>
                <PanelHead
                  action={
                    response && (
                      <Box
                        sx={{
                          color: t => t.palette.text.disabled,
                          fontSize: t => styleUtils(t).fontSize.normal,
                          fontWeight: 'normal',
                          display: 'inline',
                        }}
                      >
                        {formatDateTime(response.data.creationDate)}
                      </Box>
                    )
                  }
                >
                  {m.proAnswerYourAnswer}
                </PanelHead>
                <ReportResponseComponent
                  canEditFile={false}
                  response={response?.data}
                  consumerReportReview={_getReviewOnReportResponse.data}
                  report={report}
                  files={_getReport.data?.files.filter(_ => _.origin === FileOrigin.Professional)}
                />
              </Panel>
            </Collapse>
            <Collapse in={!response && openAnswerPanel.value}>
              <ReportResponseForm
                ref={responseFormRef}
                report={report}
                onConfirm={() => {
                  openAnswerPanel.setFalse()
                  queryClient
                    .invalidateQueries({queryKey: GetReportEventsQueryKeys(report.id)})
                    .then(() => queryClient.invalidateQueries({queryKey: GetReportQueryKeys(report.id)}))
                }}
                onCancel={openAnswerPanel.setFalse}
                sx={{
                  transition: t => t.transitions.create('box-shadow'),
                }}
              />
            </Collapse>

            {reportEvents.data && (
              <Panel>
                <PanelHead>{m.reportHistory}</PanelHead>
                <ReportEvents events={[creationReportEvent(report), ...reportEvents.data]} />
              </Panel>
            )}
          </>
        ))
        .toUndefined()}
    </Page>
  )
}

interface ReportInfluencerPanelProps {
  influencer: Influencer
}
export const ReportInfluencerPanel = ({influencer}: ReportInfluencerPanelProps) => {
  const {m} = useI18n()

  return (
    <Panel>
      <PanelHead>{m.influencerIdentifiedTitle}</PanelHead>
      <PanelBody>
        <ReportInfluencer influencer={influencer} />
      </PanelBody>
    </Panel>
  )
}
