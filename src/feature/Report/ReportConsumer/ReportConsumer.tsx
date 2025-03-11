import { WithReferenceNumberTooltip } from 'feature/Report/WithReferenceNumberTooltip'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'
import { ReportBlockTitle } from 'shared/ReportBlockTitle'
import { ReportElementRow, ReportElementsGrid } from 'shared/tinyComponents'
import {
  Report,
  ReportConsumerUpdate,
  ReportSearchResult,
} from '../../../core/client/report/Report'
import { useApiContext } from '../../../core/context/ApiContext'
import { capitalize } from '../../../core/helper'
import { useI18n } from '../../../core/i18n'
import { GetReportQueryKeys } from '../../../core/queryhooks/reportQueryHooks'
import { ScButton } from '../../../shared/Button'
import { UserNameLabel } from '../../../shared/UserNameLabel'
import { QuickSmallReportSearchLink } from '../quickSmallLinks'
import { EditConsumerDialog } from './EditConsumerDialog'

interface Props {
  report: Report
  canEdit?: boolean
}

export const ReportConsumer = ({ report, canEdit }: Props) => {
  const { m } = useI18n()
  const { api } = useApiContext()
  const queryClient = useQueryClient()
  const _updateReportConsumer = useMutation({
    mutationFn: (params: {
      reportId: string
      reportConsumerUpdate: ReportConsumerUpdate
    }) =>
      api.secured.reports.updateReportConsumer(
        params.reportId,
        params.reportConsumerUpdate,
      ),
    onSuccess: (report) =>
      queryClient.setQueryData(
        GetReportQueryKeys(report.id),
        (prev: ReportSearchResult) => {
          return { report, files: prev?.files ?? [] }
        },
      ),
  })

  const { firstName, lastName, contactAgreement } = report

  return (
    <CleanDiscreetPanel>
      <div className="flex items-center justify-between">
        <ReportBlockTitle icon="person">{m.consumer}</ReportBlockTitle>
        {canEdit && (
          <EditConsumerDialog
            report={report}
            onChange={(consumer) =>
              _updateReportConsumer.mutate({
                reportId: report.id,
                reportConsumerUpdate: consumer,
              })
            }
          >
            <ScButton
              icon="edit"
              color="primary"
              loading={_updateReportConsumer.isPending}
            >
              {m.edit}
            </ScButton>
          </EditConsumerDialog>
        )}
      </div>
      <div
        className={`${contactAgreement ? '' : 'bg-red-100 py-2 px-4 w-full'}`}
      >
        <ReportElementsGrid>
          {contactAgreement || (
            <div className="font-bold sm:col-span-2 text-sm text-red-600 mb-2">
              {m.reportConsumerWantToBeAnonymous}.
              <br />
              Ne pas divulguer ces informations à l'entreprise.
            </div>
          )}
          <ReportElementRow label="Nom">
            <UserNameLabel
              firstName={capitalize(firstName)}
              lastName={capitalize(lastName)}
            />
          </ReportElementRow>
          <ReportElementRow label="Email">
            <div className="mb-2">
              <div>{report.email}</div>
              <div className="-mt-1.5">
                <QuickSmallReportSearchLink
                  reportSearch={{
                    email: report.email,
                  }}
                />
              </div>
            </div>
          </ReportElementRow>
          {report.consumerPhone && (
            <ReportElementRow label="Téléphone">
              <div className="mb-2">
                <div>{report.consumerPhone}</div>
                <div className="-mt-1.5">
                  <QuickSmallReportSearchLink
                    reportSearch={{
                      consumerPhone: report.consumerPhone,
                      hasConsumerPhone: true,
                    }}
                  />
                </div>
              </div>
            </ReportElementRow>
          )}
          {report.consumerReferenceNumber && (
            <ReportElementRow
              label={
                <WithReferenceNumberTooltip>
                  {m.reportConsumerReferenceNumber}
                </WithReferenceNumberTooltip>
              }
            >
              <p>{report.consumerReferenceNumber}</p>
            </ReportElementRow>
          )}
        </ReportElementsGrid>
      </div>
    </CleanDiscreetPanel>
  )
}
