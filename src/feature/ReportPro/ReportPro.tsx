import {useParams} from 'react-router'
import {EventActionValues, FileOrigin, Id} from '../../core/api/model'
import {useI18n} from '../../core/i18n'
import React, {useEffect, useMemo} from 'react'
import {fromNullable} from 'fp-ts/lib/Option'
import {useReportContext} from '../../core/context/ReportContext'
import {useToast} from '../../core/toast'
import {Page} from '../../shared/Layout'
import {ReportHeader} from '../Report/ReportHeader'
import {ReportEvents} from '../Report/Event/ReportEvents'
import {creationReportEvent} from '../Report/Report'
import {Panel, PanelHead, PanelTitle} from '../../shared/Panel'
import {ReportAnswerPro} from '../ReportAnswerPro/ReportAnswerPro'
import {useBoolean} from '@alexandreannic/react-hooks-lib/lib'
import {Collapse, makeStyles, Theme} from '@material-ui/core'
import {ReportMessages} from '../Report/ReportMessages'

const useStyles = makeStyles((t: Theme) => ({
  answerPanel: {
    transition: t.transitions.create('box-shadow'),
  },
}))

export const ReportPro = () => {
  const {id} = useParams<{id: Id}>()
  const {m} = useI18n()
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
            onClickAnswerBtn={response ? undefined : openAnswerPanel.setTrue}
          />

          <Collapse in={_report.events.entity && !!response}>
            <Panel>
              <PanelHead>{m.proAnswerYourAnswer}</PanelHead>
              <ReportMessages
                canEditFile={false}
                response={response}
                reportId={report.id}
                files={_report.get.entity?.files.filter(_ => _.origin === FileOrigin.Professional)}/>
            </Panel>
          </Collapse>
          <Collapse in={!response && openAnswerPanel.value}>
            <ReportAnswerPro
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
