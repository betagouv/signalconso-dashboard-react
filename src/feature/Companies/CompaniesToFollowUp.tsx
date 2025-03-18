import { Box, Checkbox, Icon, Tooltip } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { SyntheticEvent } from 'react'
import { Fender, IconBtn, Txt } from '../../alexlibs/mui-extension'
import { useSetState } from '../../alexlibs/react-hooks-lib'
import { EntityIcon } from '../../core/EntityIcon'
import { useApiContext } from '../../core/context/ApiContext'
import { useI18n } from '../../core/i18n'
import { Id } from '../../core/model'
import {
  CompanyToFollowUpSearchQueryKeys,
  useCompanyToFollowUpSearchQuery,
} from '../../core/queryhooks/companyQueryHooks'
import { styleUtils, sxUtils } from '../../core/theme'
import { AddressComponent } from '../../shared/Address'
import { ScButton } from '../../shared/Button'
import { Datatable } from '../../shared/Datatable/Datatable'
import { DatatableToolbar } from '../../shared/Datatable/DatatableToolbar'
import { ScDialog } from '../../shared/ScDialog'

export const CompaniesToFollowUp = () => {
  const { m } = useI18n()
  const { api } = useApiContext()
  const queryClient = useQueryClient()
  const _companiesToFollowUp = useCompanyToFollowUpSearchQuery()
  const _confirmCompaniesFollowedUp = useMutation({
    mutationFn: api.secured.company.confirmCompaniesFollowedUp,
    onSuccess: () =>
      queryClient
        .invalidateQueries({ queryKey: CompanyToFollowUpSearchQueryKeys })
        .then(unselectAll),
  })
  const _downloadActivationDocument = useMutation({
    mutationFn: api.secured.company.downloadFollowUpDocument,
  })

  const selectedCompaniesSet = useSetState<string>([])

  const toggleSelectedCompany = (companyId: Id) => {
    return selectedCompaniesSet.has(companyId)
      ? selectedCompaniesSet.delete(companyId)
      : selectedCompaniesSet.add(companyId)
  }

  const allChecked =
    selectedCompaniesSet.size ===
    (_companiesToFollowUp.result.data?.entities.length ?? 0)

  const selectAll = () => {
    if (selectedCompaniesSet.size === 0 && !allChecked)
      selectedCompaniesSet.reset(
        _companiesToFollowUp.result.data?.entities.map((_) => _.company.id),
      )
    else selectedCompaniesSet.clear()
  }

  const unselectAll = () => {
    selectedCompaniesSet.clear()
  }

  const confirmCompaniesFollowedUp = (
    event: SyntheticEvent<any>,
    closeDialog: () => void,
  ) => {
    _confirmCompaniesFollowedUp
      .mutateAsync(selectedCompaniesSet.toArray())
      .finally(closeDialog)
  }

  return (
    <>
      <Datatable
        id="companiestoactivate"
        superheader={
          <div>
            {m.companiesToFollowUpDesc}
            <p className="mt-2 italic text-gray-500">
              {m.companiesToFollowUpDescDetail}
            </p>
          </div>
        }
        headerMain={
          <DatatableToolbar
            onClear={selectedCompaniesSet.clear}
            open={
              !_companiesToFollowUp.result.isFetching &&
              selectedCompaniesSet.size > 0
            }
            actions={
              <>
                <ScButton
                  disabled={
                    _companiesToFollowUp.result.isFetching ||
                    selectedCompaniesSet.size === 0
                  }
                  loading={_downloadActivationDocument.isPending}
                  color="primary"
                  variant="outlined"
                  icon="file_download"
                  sx={{ mr: 1 }}
                  onClick={() =>
                    _downloadActivationDocument.mutate(
                      selectedCompaniesSet.toArray(),
                    )
                  }
                >
                  {m.downloadNotice}
                </ScButton>
                <ScDialog
                  title={m.validateLetterSentTitle}
                  content={m.validateLetterSentDesc}
                  onConfirm={confirmCompaniesFollowedUp}
                >
                  <ScButton
                    disabled={
                      _companiesToFollowUp.result.isFetching ||
                      selectedCompaniesSet.size === 0
                    }
                    loading={_confirmCompaniesFollowedUp.isPending}
                    sx={{ mr: 1 }}
                    color="error"
                    variant="contained"
                    icon="check_circle"
                  >
                    {m.markNoticesSent}
                  </ScButton>
                </ScDialog>
              </>
            }
          >
            <Txt bold>{selectedCompaniesSet.size}</Txt>&nbsp;
            {m.selectedCompanies}
          </DatatableToolbar>
        }
        loading={_companiesToFollowUp.result.isFetching}
        data={_companiesToFollowUp.result.data?.entities}
        paginate={{
          offset: _companiesToFollowUp.filters.offset,
          limit: _companiesToFollowUp.filters.limit,
          onPaginationChange: (pagination) =>
            _companiesToFollowUp.updateFilters((prev) => ({
              ...prev,
              ...pagination,
            })),
        }}
        total={_companiesToFollowUp.result.data?.totalCount}
        getRenderRowKey={(_) => _.company.id}
        rowsPerPageExtraOptions={[250]}
        columns={[
          {
            head: (
              <Checkbox
                indeterminate={!allChecked && selectedCompaniesSet.size > 0}
                checked={allChecked}
                disabled={_companiesToFollowUp.result.isFetching}
                onClick={selectAll}
              />
            ),
            alwaysVisible: true,
            id: 'select',
            render: (_) => (
              <Checkbox
                checked={selectedCompaniesSet.has(_.company.id)}
                onClick={() => toggleSelectedCompany(_.company.id)}
              />
            ),
          },
          {
            id: 'siret',
            head: m.name,
            sx: (_) => ({
              lineHeight: 1.4,
              maxWidth: 390,
            }),
            render: (_) => (
              <Tooltip title={_.company.name}>
                <span>
                  <Box
                    component="span"
                    sx={{
                      marginBottom: '-1px',
                      fontWeight: (t) => t.typography.fontWeightBold,
                    }}
                  >
                    {_.company.name}
                  </Box>
                  <br />
                  <Box
                    component="span"
                    sx={{
                      fontSize: (t) => styleUtils(t).fontSize.small,
                      color: (t) => t.palette.text.disabled,
                    }}
                  >
                    {_.company.siret}
                  </Box>
                </span>
              </Tooltip>
            ),
          },
          {
            head: m.address,
            id: 'address',
            sx: (_) => ({
              pt: 0.5,
              pb: 0.5,
              fontSize: (t) => styleUtils(t).fontSize.small,
              color: (t) => t.palette.text.secondary,
              maxWidth: 300,
              ...sxUtils.truncate,
            }),
            render: (_) => (
              <Tooltip title={<AddressComponent address={_.company.address} />}>
                <span>
                  <AddressComponent address={_.company.address} />
                </span>
              </Tooltip>
            ),
          },
          {
            head: m.ignoredReportCount,
            id: 'ignoredReportCount',
            render: (_) => <>{_.ignoredReportCount}</>,
          },
          {
            id: 'actions',
            sx: (_) => sxUtils.tdActions,
            stickyEnd: true,
            render: (_) => (
              <>
                <Link
                  target="_blank"
                  to="/suivi-des-signalements"
                  search={{
                    hasCompany: true,
                    siretSirenList: [_.company.siret],
                  }}
                >
                  <Tooltip title={m.reports}>
                    <IconBtn color="primary">
                      <Icon>chevron_right</Icon>
                    </IconBtn>
                  </Tooltip>
                </Link>
              </>
            ),
          },
        ]}
        renderEmptyState={
          <Fender title={m.noCompanyFound} icon={EntityIcon.company} />
        }
      />
    </>
  )
}
