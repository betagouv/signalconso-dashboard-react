import { ReportReferenceNumber } from 'feature/Report/ReportReferenceNumber'

import { WithInlineIcon } from 'shared/WithInlineIcon'
import {
  Report,
  ReportConsumerUpdate,
  ReportSearchResult,
} from '../../../core/client/report/Report'
import { capitalize } from '../../../core/helper'
import { useI18n } from '../../../core/i18n'
import { ScButton } from '../../../shared/Button'
import { Panel, PanelBody, PanelHead } from '../../../shared/Panel'
import { EditConsumerDialog } from './EditConsumerDialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiContext } from '../../../core/context/ApiContext'
import { GetReportQueryKeys } from '../../../core/queryhooks/reportQueryHooks'
import { CleanDiscreetPanel, CleanWidePanel } from 'shared/Panel/simplePanels'
import { UserNameLabel } from '../../../shared/UserNameLabel'
import { Icon } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { siteMap } from '../../../core/siteMap'

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
        <WithInlineIcon icon="person">{m.consumer}</WithInlineIcon>
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
      <div>
        <div className={contactAgreement ? '' : 'bg-red-100 py-2 px-4 w-full'}>
          {contactAgreement || (
            <div className="font-bold text-sm text-red-600 mb-2">
              {m.reportConsumerWantToBeAnonymous}.
              <br />
              Ne pas divulguer ces informations à l'entreprise.
            </div>
          )}
          <UserNameLabel
            firstName={capitalize(firstName)}
            lastName={capitalize(lastName)}
          />
          <div className="text-gray-500">
            <NavLink
              to={siteMap.logged.reports({
                email: report.email,
              })}
            >
              {report.email}
            </NavLink>
          </div>
          {report.consumerPhone && (
            <div className="text-gray-500">
              <NavLink
                to={siteMap.logged.reports({
                  consumerPhone: report.consumerPhone,
                  hasConsumerPhone: true,
                })}
              >
                {report.consumerPhone}
              </NavLink>
            </div>
          )}
          <ReportReferenceNumber
            consumerReferenceNumber={report.consumerReferenceNumber}
          />
        </div>
      </div>
    </CleanDiscreetPanel>
  )
}
