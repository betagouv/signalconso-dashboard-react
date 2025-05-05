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
  CompanyToActivateSearchQueryKeys,
  useCompanyToActivateSearchQuery,
} from '../../core/queryhooks/companyQueryHooks'
import { styleUtils, sxUtils } from '../../core/theme'
import { AddressComponent } from '../../shared/Address'
import { ScButton } from '../../shared/Button'
import { Datatable } from '../../shared/Datatable/Datatable'
import { DatatableToolbar } from '../../shared/Datatable/DatatableToolbar'
import { ScDialog } from '../../shared/ScDialog'

export const CompaniesToActivate = () => {
  const { m, formatDate } = useI18n()
  const { api } = useApiContext()
  const queryClient = useQueryClient()
  const _companiesToActivate = useCompanyToActivateSearchQuery()
  const _confirmCompaniesPosted = useMutation({
    mutationFn: api.secured.company.confirmCompaniesPosted,
    onSuccess: () =>
      queryClient
        .invalidateQueries({ queryKey: CompanyToActivateSearchQueryKeys })
        .then(unselectAll),
  })
  const _downloadActivationDocument = useMutation({
    mutationFn: api.secured.company.downloadActivationDocument,
  })

  const selectedCompaniesSet = useSetState<string>([])

  const toggleSelectedCompany = (companyId: Id) => {
    return selectedCompaniesSet.has(companyId)
      ? selectedCompaniesSet.delete(companyId)
      : selectedCompaniesSet.add(companyId)
  }

  const allChecked =
    selectedCompaniesSet.size ===
    (_companiesToActivate.result.data?.entities.length ?? 0)

  const selectAll = () => {
    if (selectedCompaniesSet.size === 0 && !allChecked)
      selectedCompaniesSet.reset(
        _companiesToActivate.result.data?.entities.map((_) => _.company.id),
      )
    else selectedCompaniesSet.clear()
  }

  const unselectAll = () => {
    selectedCompaniesSet.clear()
  }

  const confirmCompaniesPosted = (
    event: SyntheticEvent<any>,
    closeDialog: () => void,
  ) => {
    _confirmCompaniesPosted
      .mutateAsync(selectedCompaniesSet.toArray())
      .finally(closeDialog)
  }

  return (
    <>
      <Datatable
        id="companiestoactivate"
        superheader={
          <p>
            {m.companiesToActivateDesc}{' '}
            <span className="text-gray-500 italic">
              {m.companiesToActivateDescDetail}
            </span>
          </p>
        }
        headerMain={
          <DatatableToolbar
            onClear={selectedCompaniesSet.clear}
            open={
              !_companiesToActivate.result.isFetching &&
              selectedCompaniesSet.size > 0
            }
            actions={
              <>
                <ScButton
                  disabled={
                    _companiesToActivate.result.isFetching ||
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
                  onConfirm={confirmCompaniesPosted}
                >
                  <ScButton
                    disabled={
                      _companiesToActivate.result.isFetching ||
                      selectedCompaniesSet.size === 0
                    }
                    loading={_confirmCompaniesPosted.isPending}
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
        loading={_companiesToActivate.result.isFetching}
        data={_companiesToActivate.result.data?.entities}
        paginate={{
          offset: _companiesToActivate.filters.offset,
          limit: _companiesToActivate.filters.limit,
          onPaginationChange: (pagination) =>
            _companiesToActivate.updateFilters((prev) => ({
              ...prev,
              ...pagination,
            })),
        }}
        total={_companiesToActivate.result.data?.totalCount}
        getRenderRowKey={(_) => _.company.id}
        rowsPerPageExtraOptions={[250]}
        columns={[
          {
            head: (
              <Checkbox
                slotProps={{
                  input: {
                    'aria-label': 'Sélectionner toutes les entreprises',
                  },
                }}
                indeterminate={!allChecked && selectedCompaniesSet.size > 0}
                checked={allChecked}
                disabled={_companiesToActivate.result.isFetching}
                onClick={selectAll}
              />
            ),
            alwaysVisible: true,
            id: 'select',
            render: (_) => (
              <Checkbox
                slotProps={{
                  input: {
                    'aria-label': "Sélectionner l'entreprise",
                  },
                }}
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
                      color: (t) => t.palette.text.secondary,
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
            head: m.created_at,
            id: 'tokenCreation',
            render: (_) => <>{formatDate(_.tokenCreation)}</>,
          },
          {
            head: m.lastNotice,
            id: 'lastNotice',
            render: (_) => <>{formatDate(_.lastNotice)}</>,
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
