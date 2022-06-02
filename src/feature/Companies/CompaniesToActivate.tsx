import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Id} from '@signal-conso/signalconso-api-sdk-js'
import React, {SyntheticEvent, useEffect} from 'react'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {Box, Checkbox, Icon, Theme, Tooltip} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {styleUtils, sxUtils} from '../../core/theme'
import {Fender, IconBtn} from 'mui-extension/lib'
import {Link} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {usePersistentState} from 'react-persistent-state'
import {useSetState} from '@alexandreannic/react-hooks-lib/lib'
import {ScButton} from '../../shared/Button/Button'
import {useToast} from '../../core/toast'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {fromNullable} from 'fp-ts/lib/Option'
import {EntityIcon} from '../../core/EntityIcon'
import {AddressComponent} from '../../shared/Address/Address'
import {ScDialog} from '../../shared/Confirm/ScDialog'

export const CompaniesToActivate = () => {
  const {m, formatDate} = useI18n()
  const _companies = useCompaniesContext()
  const _companiesToActivate = _companies.toActivate

  const [selectedCompanies, setSelectedCompanies] = usePersistentState<string[]>([], 'CompaniesToActivate')
  const selectedCompaniesSet = useSetState(selectedCompanies)
  const {toastError} = useToast()

  useEffect(() => {
    _companiesToActivate.fetch()
  }, [])

  useEffect(() => {
    fromNullable(_companiesToActivate.error).map(toastError)
  }, [_companiesToActivate.error])

  const toggleSelectedCompany = (companyId: Id) => {
    selectedCompaniesSet.has(companyId) ? selectedCompaniesSet.delete(companyId) : selectedCompaniesSet.add(companyId)
    setSelectedCompanies(selectedCompaniesSet.toArray())
  }

  const allChecked = selectedCompaniesSet.size === (_companiesToActivate.list?.data.length ?? 0)

  const selectAll = () => {
    if (selectedCompaniesSet.size === 0 && !allChecked)
      selectedCompaniesSet.reset(_companiesToActivate.list?.data.map(_ => _.company.id))
    else selectedCompaniesSet.clear()
    setSelectedCompanies(selectedCompaniesSet.toArray())
  }

  const unselectAll = () => {
    selectedCompaniesSet.clear()
    setSelectedCompanies(selectedCompaniesSet.toArray())
  }

  const confirmCompaniesPosted = (event: SyntheticEvent<any>, closeDialog: () => void) => {
    _companies.confirmCompaniesPosted
      .fetch({}, selectedCompaniesSet.toArray())
      .then(() => {
        _companiesToActivate.fetch({clean: false})
      })
      .then(unselectAll)
      .catch(toastError)
      .finally(closeDialog)
  }

  return (
    <Panel>
      <Datatable
        id="companiestoactivate"
        header={
          <>
            <ScButton
              disabled={_companiesToActivate.fetching || selectedCompaniesSet.size === 0}
              loading={_companies.downloadActivationDocument.loading}
              color="primary"
              variant="outlined"
              icon="file_download"
              sx={{mr: 1}}
              onClick={() => _companies.downloadActivationDocument.fetch({}, selectedCompaniesSet.toArray()).catch(toastError)}
            >
              {m.download}
            </ScButton>
            <ScDialog title={m.validateLetterSentTitle} content={m.validateLetterSentDesc} onConfirm={confirmCompaniesPosted}>
              <ScButton
                disabled={_companiesToActivate.fetching || selectedCompaniesSet.size === 0}
                loading={_companies.confirmCompaniesPosted.loading}
                sx={{mr: 1}}
                color="error"
                variant="contained"
                icon="check_circle"
              >
                {m.validateLetterSent}
              </ScButton>
            </ScDialog>
            {!_companiesToActivate.fetching && selectedCompaniesSet.size > 0 && (
              <div>
                <Box component="span" sx={{
                  borderRadius: '30px',
                  minWidth: 22,
                  height: 22,
                  lineHeight: '22px',
                  px: 1,
                  textAlign: 'center',
                  background: t => t.palette.primary.main,
                  color: t => t.palette.primary.contrastText,
                  fontWeight: 'bold',
                  marginRight: '4px',
                }}>
                  {selectedCompaniesSet.size}
                </Box>
                <Txt color="hint">{m.selectedCompanies}</Txt>
              </div>
            )}
          </>
        }
        loading={_companiesToActivate.fetching}
        data={_companiesToActivate.list?.data}
        paginate={{
          offset: _companiesToActivate.filters.offset,
          limit: _companiesToActivate.filters.limit,
          onPaginationChange: pagination => _companiesToActivate.updateFilters(prev => ({...prev, ...pagination})),
        }}
        total={_companiesToActivate.list?.totalSize}
        getRenderRowKey={_ => _.company.id}
        showColumnsToggle={true}
        rowsPerPageOptions={[5, 10, 25, 100, 250]}
        columns={[
          {
            head: (
              <Checkbox
                indeterminate={!allChecked && selectedCompaniesSet.size > 0}
                checked={allChecked}
                disabled={_companiesToActivate.fetching}
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
            sx: {
              lineHeight: 1.4,
              maxWidth: 390,
            },
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
            sx: {
              pt: .5,
              pb: .5,
              fontSize: t => styleUtils(t).fontSize.small,
              color: t => t.palette.text.secondary,
              maxWidth: 300,
              ...sxUtils.truncate,
            },
            render: _ => (
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
            render: _ => <>{formatDate(_.tokenCreation)}</>,
          },
          {
            head: m.lastNotice,
            id: 'lastNotice',
            render: _ => <>{formatDate(_.lastNotice)}</>,
          },
          {
            id: 'actions',
            sx: sxUtils.tdActions,
            stickyEnd: true,
            render: _ => (
              <>
                <Link target="_blank" to={siteMap.logged.reports({siretSirenList: [_.company.siret]})}>
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
