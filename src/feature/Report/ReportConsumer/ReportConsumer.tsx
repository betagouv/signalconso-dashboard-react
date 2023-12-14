import {ReportReferenceNumber} from 'feature/Report/ReportReferenceNumber'

import {WithInlineIcon} from 'shared/WithInlineIcon'
import {Report, ReportConsumerUpdate} from '../../../core/client/report/Report'
import {capitalize} from '../../../core/helper'
import {useI18n} from '../../../core/i18n'
import {ScButton} from '../../../shared/Button'
import {Panel, PanelBody, PanelHead} from '../../../shared/Panel'
import {EditConsumerDialog} from './EditConsumerDialog'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useApiContext} from '../../../core/context/ApiContext'
import {GetReportQueryKeys} from '../../../core/queryhooks/reportQueryHooks'

interface Props {
  report: Report
  canEdit?: boolean
}

export const ReportConsumer = ({report, canEdit}: Props) => {
  const {m} = useI18n()
  const {api} = useApiContext()
  const queryClient = useQueryClient()
  const _updateReportConsumer = useMutation({
    mutationFn: (params: {reportId: string; reportConsumerUpdate: ReportConsumerUpdate}) =>
      api.secured.reports.updateReportConsumer(params.reportId, params.reportConsumerUpdate),
    onSuccess: () => queryClient.invalidateQueries({queryKey: GetReportQueryKeys(report.id)}),
  })

  const {firstName, lastName, contactAgreement} = report

  return (
    <Panel stretch>
      <PanelHead
        action={
          canEdit && (
            <EditConsumerDialog
              report={report}
              onChange={consumer => _updateReportConsumer.mutate({reportId: report.id, reportConsumerUpdate: consumer})}
            >
              <ScButton icon="edit" color="primary" loading={_updateReportConsumer.isPending}>
                {m.edit}
              </ScButton>
            </EditConsumerDialog>
          )
        }
      >
        <WithInlineIcon icon="person">{m.consumer}</WithInlineIcon>
      </PanelHead>
      <PanelBody>
        <div className={contactAgreement ? '' : 'bg-red-100 py-2 px-4 w-full'}>
          {contactAgreement || (
            <div className="font-bold text-sm text-red-600 mb-2">
              {m.reportConsumerWantToBeAnonymous}.
              <br />
              Ne pas divulguer ces informations à l'entreprise.
            </div>
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
