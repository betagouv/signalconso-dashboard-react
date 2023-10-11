import {Box, Checkbox, Icon, Tooltip} from '@mui/material'
import {SyntheticEvent, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Fender, IconBtn, Txt} from '../../alexlibs/mui-extension'
import {useSetState} from '../../alexlibs/react-hooks-lib'
import {usePersistentState} from '../../alexlibs/react-persistent-state'
import {EntityIcon} from '../../core/EntityIcon'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useI18n} from '../../core/i18n'
import {Id} from '../../core/model'
import {siteMap} from '../../core/siteMap'
import {styleUtils, sxUtils} from '../../core/theme'
import {useToast} from '../../core/toast'
import {AddressComponent} from '../../shared/Address'
import {ScButton} from '../../shared/Button'
import {ScDialog} from '../../shared/ScDialog'
import {Datatable} from '../../shared/Datatable/Datatable'
import {DatatableToolbar} from '../../shared/Datatable/DatatableToolbar'
import {Panel} from '../../shared/Panel'

export const CompaniesToFollowUp = () => {
  const {m, formatDate} = useI18n()
  const _companies = useCompaniesContext()
  const _companiesToFollowUp = _companies.toFollowUp

  const [selectedCompanies, setSelectedCompanies] = usePersistentState<string[]>([], 'CompaniesToFollowUp')
  const selectedCompaniesSet = useSetState(selectedCompanies)
  const {toastError, toastErrorIfDefined} = useToast()

  useEffect(() => {
    _companiesToFollowUp.fetch()
  }, [])

  useEffect(() => {
    toastErrorIfDefined(_companiesToFollowUp.error)
  }, [_companiesToFollowUp.error])

  const toggleSelectedCompany = (companyId: Id) => {
    selectedCompaniesSet.has(companyId) ? selectedCompaniesSet.delete(companyId) : selectedCompaniesSet.add(companyId)
    setSelectedCompanies(selectedCompaniesSet.toArray())
  }

  const allChecked = selectedCompaniesSet.size === (_companiesToFollowUp.list?.entities.length ?? 0)

  const selectAll = () => {
    if (selectedCompaniesSet.size === 0 && !allChecked)
      selectedCompaniesSet.reset(_companiesToFollowUp.list?.entities.map(_ => _.company.id))
    else selectedCompaniesSet.clear()
    setSelectedCompanies(selectedCompaniesSet.toArray())
  }

  const unselectAll = () => {
    selectedCompaniesSet.clear()
    setSelectedCompanies(selectedCompaniesSet.toArray())
  }

  const confirmCompaniesFollowedUp = (event: SyntheticEvent<any>, closeDialog: () => void) => {
    _companies.confirmCompaniesFollowedUp
      .fetch({}, selectedCompaniesSet.toArray())
      .then(() => {
        _companiesToFollowUp.fetch({clean: false})
      })
      .then(unselectAll)
      .catch(toastError)
      .finally(closeDialog)
  }

  return (
    <Panel sx={{overflow: 'visible'}}>
      <Box sx={{p: 2}}>
        <Txt color="default">
          {m.companiesToFollowUpDesc}
          <p className="mt-2">
            <Txt color="hint" italic>
              {m.companiesToFollowUpDescDetail}
            </Txt>
          </p>
        </Txt>
      </Box>
      <Datatable
        id="companiestoactivate"
        header={
          <DatatableToolbar
            onClear={selectedCompaniesSet.clear}
            open={!_companiesToFollowUp.fetching && selectedCompaniesSet.size > 0}
            actions={
              <>
                <ScButton
                  disabled={_companiesToFollowUp.fetching || selectedCompaniesSet.size === 0}
                  loading={_companies.downloadFollowUpDocument.loading}
                  color="primary"
                  variant="outlined"
                  icon="file_download"
                  sx={{mr: 1}}
                  onClick={() => _companies.downloadFollowUpDocument.fetch({}, selectedCompaniesSet.toArray()).catch(toastError)}
                >
                  {m.downloadNotice}
                </ScButton>
                <ScDialog
                  title={m.validateLetterSentTitle}
                  content={m.validateLetterSentDesc}
                  onConfirm={confirmCompaniesFollowedUp}
                >
                  <ScButton
                    disabled={_companiesToFollowUp.fetching || selectedCompaniesSet.size === 0}
                    loading={_companies.confirmCompaniesFollowedUp.loading}
                    sx={{mr: 1}}
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
            <Txt bold>{selectedCompaniesSet.size}</Txt>&nbsp;{m.selectedCompanies}
          </DatatableToolbar>
        }
        loading={_companiesToFollowUp.fetching}
        data={_companiesToFollowUp.list?.entities}
        paginate={{
          offset: _companiesToFollowUp.filters.offset,
          limit: _companiesToFollowUp.filters.limit,
          onPaginationChange: pagination => _companiesToFollowUp.updateFilters(prev => ({...prev, ...pagination})),
        }}
        total={_companiesToFollowUp.list?.totalCount}
        getRenderRowKey={_ => _.company.id}
        showColumnsToggle={true}
        rowsPerPageOptions={[5, 10, 25, 100, 250]}
        columns={[
          {
            head: (
              <Checkbox
                indeterminate={!allChecked && selectedCompaniesSet.size > 0}
                checked={allChecked}
                disabled={_companiesToFollowUp.fetching}
                onClick={selectAll}
              />
            ),
            alwaysVisible: true,
            id: 'select',
            render: _ => (
              <Checkbox checked={selectedCompaniesSet.has(_.company.id)} onClick={() => toggleSelectedCompany(_.company.id)} />
            ),
          },
          {
            id: 'siret',
            head: m.name,
            sx: _ => ({
              lineHeight: 1.4,
              maxWidth: 390,
            }),
            render: _ => (
              <Tooltip title={_.company.name}>
                <span>
                  <Box component="span" sx={{marginBottom: '-1px', fontWeight: t => t.typography.fontWeightBold}}>
                    {_.company.name}
                  </Box>
                  <br />
                  <Box component="span" sx={{fontSize: t => styleUtils(t).fontSize.small, color: t => t.palette.text.disabled}}>
                    {_.company.siret}
                  </Box>
                </span>
              </Tooltip>
            ),
          },
          {
            head: m.address,
            id: 'address',
            sx: _ => ({
              pt: 0.5,
              pb: 0.5,
              fontSize: t => styleUtils(t).fontSize.small,
              color: t => t.palette.text.secondary,
              maxWidth: 300,
              ...sxUtils.truncate,
            }),
            render: _ => (
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
            render: _ => <>{_.ignoredReportCount}</>,
          },
          {
            id: 'actions',
            sx: _ => sxUtils.tdActions,
            stickyEnd: true,
            render: _ => (
              <>
                <Link target="_blank" to={siteMap.logged.reports({hasCompany: true, siretSirenList: [_.company.siret]})}>
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
        renderEmptyState={<Fender title={m.noCompanyFound} icon={EntityIcon.company} />}
      />
    </Panel>
  )
}
