import {useParams} from 'react-router'
import {EventActionValues, FileOrigin, Id, Report} from '@signal-conso/signalconso-api-sdk-js'
import {useI18n} from '../../core/i18n'
import React, {useEffect, useMemo, useRef} from 'react'
import {fromNullable} from 'fp-ts/lib/Option'
import {useReportContext} from '../../core/context/ReportContext'
import {useToast} from '../../core/toast'
import {Page} from '../../shared/Layout'
import {ReportHeader} from './ReportHeader'
import {useBoolean} from '@alexandreannic/react-hooks-lib/lib'
import {Box, Collapse} from '@mui/material'
import {ScButton} from '../../shared/Button/Button'
import {styleUtils} from '../../core/theme'
import {capitalize} from '../../core/helper/utils'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {ReportDescription} from './ReportDescription'
import {ReportResponseForm} from './ReportResponseForm/ReportResponseForm'
import {Panel, PanelHead} from '../../shared/Panel'
import {ReportResponseComponent} from './ReportResponse'
import {ReportEvents} from './Event/ReportEvents'
import {creationReportEvent} from './Report'
import {useEventContext} from '../../core/context/EventContext'

export const ReportPro = () => {
  const {id} = useParams<{id: Id}>()
  const {m, formatDateTime} = useI18n()
  const _report = useReportContext()
  const _event = useEventContext()
  const {toastError} = useToast()
  const openAnswerPanel = useBoolean(false)
  const response = useMemo(
    () => _event.reportEvents.entity?.find(_ => _.data.action === EventActionValues.ReportProResponse),
    [_event.reportEvents],
  )
  const responseFormRef = useRef<any>(null)

  useEffect(() => {
    _report.get.fetch({}, id)
    _event.reportEvents.fetch({}, id)
  }, [])

  useEffect(() => {
    fromNullable(_report.get.error).map(toastError)
    fromNullable(_event.reportEvents.error).map(toastError)
  }, [_report.get.error, _event.reportEvents.error])

  const openResponsePanel = () => {
    openAnswerPanel.setTrue()
    setTimeout(() => {
      if (responseFormRef.current) {
        responseFormRef.current.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'})
      }
    }, 200)
  }

  return (
    <Page size="s" loading={_report.get.loading}>
      {fromNullable(_report.get.entity?.report)
        .map(report => (
          <>
            <ReportHeader hideTags={true} elevated={!openAnswerPanel.value} report={report}>
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

            <ReportDescription report={report} files={_report.get.entity?.files}>
              <Txt block bold>
                {m.consumer}
              </Txt>
              {report.contactAgreement ? (
                <>
                  <Box sx={{color: t => t.palette.text.secondary}}>
                    {fromNullable(report.firstName)
                      .map(_ => capitalize(_))
                      .getOrElse('')}
                    &nbsp;
                    {fromNullable(report.lastName)
                      .map(_ => _.toLocaleUpperCase())
                      .getOrElse('')}
                  </Box>
                  <Txt color="hint">{report.email}</Txt>
                </>
              ) : (
                <Txt color="hint">{m.reportConsumerWantToBeAnonymous}</Txt>
              )}
            </ReportDescription>

            <Collapse in={_event.reportEvents.entity && !!response}>
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
                  response={response}
                  reportId={report.id}
                  files={_report.get.entity?.files.filter(_ => _.origin === FileOrigin.Professional)}
                />
              </Panel>
            </Collapse>
            <Collapse in={!response && openAnswerPanel.value}>
              <ReportResponseForm
                ref={responseFormRef}
                report={report}
                onConfirm={() => {
                  openAnswerPanel.setFalse()
                  _event.reportEvents.fetch({clean: false, force: true}, report.id)
                  _report.get.fetch({clean: false, force: true}, id)
                }}
                onCancel={openAnswerPanel.setFalse}
                sx={{
                  transition: t => t.transitions.create('box-shadow'),
                }}
              />
            </Collapse>

            {_event.reportEvents.entity && (
              <Panel>
                <PanelHead>{m.reportHistory}</PanelHead>
                <ReportEvents events={[creationReportEvent(report), ..._event.reportEvents.entity]} />
              </Panel>
            )}
          </>
        ))
        .toUndefined()}
    </Page>
  )
}
