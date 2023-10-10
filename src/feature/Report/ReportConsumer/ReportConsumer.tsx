import {Box, useTheme} from '@mui/material'
import {ReportReferenceNumber} from 'feature/Report/ReportReferenceNumber'

import {WithInlineIcon} from 'shared/WithInlineIcon'
import {Report} from '../../../core/client/report/Report'
import {useReportContext} from '../../../core/context/ReportContext'
import {capitalize} from '../../../core/helper'
import {useI18n} from '../../../core/i18n'
import {ScButton} from '../../../shared/Button'
import {Panel, PanelBody, PanelHead} from '../../../shared/Panel'
import {EditConsumerDialog} from './EditConsumerDialog'

interface Props {
  report: Report
  canEdit?: boolean
}

export const ReportConsumer = ({report, canEdit}: Props) => {
  const _report = useReportContext()
  const {m} = useI18n()
  const theme = useTheme()

  const {firstName, lastName} = report

  return (
    <Panel stretch>
      <PanelHead
        action={
          canEdit && (
            <EditConsumerDialog report={report} onChange={consumer => _report.updateConsumer.fetch({}, report.id, consumer)}>
              <ScButton icon="edit" color="primary" loading={_report.updateConsumer.loading}>
                {m.edit}
              </ScButton>
            </EditConsumerDialog>
          )
        }
      >
        <WithInlineIcon icon="person">{m.consumer}</WithInlineIcon>
      </PanelHead>
      <PanelBody
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {!report.contactAgreement && (
            <Box sx={{color: t => t.palette.error.main}} style={{marginTop: theme.spacing(0.5)}}>
              <WithInlineIcon icon="warning">{m.reportConsumerWantToBeAnonymous}</WithInlineIcon>
            </Box>
          )}
          <div>
            {firstName ? capitalize(firstName) : ''}&nbsp;
            {lastName ? capitalize(lastName) : ''}
          </div>
          <div className="text-gray-500">{report.email}</div>
          {report.consumerPhone && <div className="text-gray-500">{report.consumerPhone}</div>}
          <ReportReferenceNumber consumerReferenceNumber={report.consumerReferenceNumber} />
        </div>
      </PanelBody>
    </Panel>
  )
}
