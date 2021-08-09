import {useParams} from 'react-router'
import {EventActionValues, FileOrigin, Id, ReportStatus} from '../../core/api/model'
import {useI18n} from '../../core/i18n'
import React, {useEffect, useMemo} from 'react'
import {fromNullable} from 'fp-ts/lib/Option'
import {useReportContext} from '../../core/context/ReportContext'
import {useToast} from '../../core/toast'
import {Page} from '../../shared/Layout'
import {ReportHeader} from '../Report/ReportHeader'
import {ReportEvents} from '../Report/Event/ReportEvents'
import {creationReportEvent} from '../Report/Report'
import {Panel, PanelHead} from '../../shared/Panel'
import {ReportResponsePro} from '../ReportAnswerPro/ReportResponsePro'
import {useBoolean} from '@alexandreannic/react-hooks-lib/lib'
import {Collapse, makeStyles, Theme} from '@material-ui/core'
import {ReportMessages} from '../Report/ReportMessages'
import {ScButton} from '../../shared/Button/Button'
import {utilsStyles} from '../../core/theme'

const useStyles = makeStyles((t: Theme) => ({
  answerPanel: {
    transition: t.transitions.create('box-shadow'),
  },
  responseDateTime: {
    color: t.palette.text.hint,
    fontSize: utilsStyles(t).fontSize.normal,
    fontWeight: 'normal',
    display: 'inline',
  },
}))

export const ReportPro = () => {
  const {id} = useParams<{id: Id}>()
  const {m, formatDateTime} = useI18n()
  const css = useStyles()
  const _report = useReportContext()
  const {toastError} = useToast()
  const openAnswerPanel = useBoolean(false)
  const response = useMemo(() => _report.events.entity?.find(_ => _.data.action === EventActionValues.ReportProResponse), [_report.events])

  useEffect(() => {
    _report.get.fetch({}, id)
    _report.events.fetch({}, id)
  }, [])

  useEffect(() => {
    fromNullable(_report.get.error).map(toastError)
    fromNullable(_report.events.error).map(toastError)
  }, [
    _report.get.error,
    _report.events.error,
  ])

  return (
    <Page size="small" loading={_report.get.loading}>
      {fromNullable(_report.get.entity?.report).map(report =>
        <>
          <ReportHeader
            elevated={!openAnswerPanel.value}
            report={report}
            files={_report.get.entity?.files}
          >
            {!response && report.status !== ReportStatus.ClosedForPro && (
              <ScButton onClick={openAnswerPanel.setTrue} icon="priority_high" color="error" variant="contained">
                {m.answer}
              </ScButton>
            )}
          </ReportHeader>

          <Collapse in={_report.events.entity && !!response}>
            <Panel>
              <PanelHead action={
                response && (
                  <div className={css.responseDateTime}>{formatDateTime(response.data.creationDate)}</div>
                )
              }>
                {m.proAnswerYourAnswer}
              </PanelHead>
              <ReportMessages
                canEditFile={false}
                response={response}
                reportId={report.id}
                files={_report.get.entity?.files.filter(_ => _.origin === FileOrigin.Professional)}/>
            </Panel>
          </Collapse>
          <Collapse in={!response && openAnswerPanel.value}>
            <ReportResponsePro
              report={report}
              onConfirm={() => {
                openAnswerPanel.setFalse()
                _report.events.fetch({clean: false, force: true}, report.id)
              }}
              onCancel={openAnswerPanel.setFalse}
              className={css.answerPanel}
            />
          </Collapse>

          {_report.events.entity && (
            <Panel>
              <PanelHead>{m.reportHistory}</PanelHead>
              <ReportEvents events={[creationReportEvent(report), ..._report.events.entity]}/>
            </Panel>
          )}
        </>,
      ).toUndefined()}
    </Page>

  )
}
