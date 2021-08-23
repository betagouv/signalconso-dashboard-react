import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {CompanyToActivate, Id} from '../../core/api'
import React, {SyntheticEvent, useEffect} from 'react'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Checkbox, Icon, makeStyles, Theme, Tooltip} from '@material-ui/core'
import {styleUtils} from '../../core/theme'
import {Confirm, Fender, IconBtn} from 'mui-extension/lib'
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

const useStyles = makeStyles((t: Theme) => ({
  tdName_label: {
    fontWeight: 'bold',
    marginBottom: -1,
  },
  selectedCountBadge: {
    borderRadius: 30,
    minWidth: 22,
    height: 22,
    lineHeight: '22px',
    padding: t.spacing(0, 1),
    textAlign: 'center',
    background: t.palette.primary.main,
    color: t.palette.primary.contrastText,
    fontWeight: 'bold',
    marginRight: 4,
  },
  tdName: {
    lineHeight: 1.4,
    maxWidth: 190,
  },
  tdName_desc: {
    fontSize: t.typography.fontSize * 0.875,
    color: t.palette.text.hint,
  },
  tdAddress: {
    paddingTop: t.spacing(0.5),
    paddingBottom: t.spacing(0.5),
    fontSize: styleUtils(t).fontSize.small,
    color: t.palette.text.secondary,
    maxWidth: 300,
    ...styleUtils(t).truncate,
  },
}))

export const CompaniesToActivate = () => {
  const {m, formatLargeNumber, formatDate} = useI18n()
  const _companies = useCompaniesContext()
  const _companiesToActivate = _companies.toActivate
  const cssUtils = useCssUtils()
  const css = useStyles()

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
      <Datatable<CompanyToActivate>
        header={
          <>
            <ScButton
              disabled={_companiesToActivate.fetching || selectedCompaniesSet.size === 0}
              loading={_companies.downloadActivationDocument.loading}
              color="primary"
              variant="outlined"
              icon="file_download"
              className={cssUtils.marginRight}
              onClick={() => _companies.downloadActivationDocument.fetch({}, selectedCompaniesSet.toArray()).catch(toastError)}
            >
              {m.download}
            </ScButton>
            <ScDialog
              title={m.validateLetterSentTitle}
              content={m.validateLetterSentDesc}
              onConfirm={confirmCompaniesPosted}
            >
              <ScButton
                disabled={_companiesToActivate.fetching || selectedCompaniesSet.size === 0}
                loading={_companies.confirmCompaniesPosted.loading}
                className={cssUtils.marginRight}
                color="error"
                variant="contained"
                icon="check_circle"
              >
                {m.validateLetterSent}
              </ScButton>
            </ScDialog>
            {!_companiesToActivate.fetching && selectedCompaniesSet.size > 0 && (
              <div>
                <span className={css.selectedCountBadge}>{selectedCompaniesSet.size}</span>
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
        rowsPerPageOptions={[5, 10, 25, 100, 500]}
        rows={[
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
            row: _ => (
              <Checkbox checked={selectedCompaniesSet.has(_.company.id)} onClick={() => toggleSelectedCompany(_.company.id)} />
            ),
          },
          {
            id: 'siret',
            head: m.name,
            className: css.tdName,
            row: _ => (
              <>
                <span className={css.tdName_label}>{_.company.name}</span>
                <br />
                <span className={css.tdName_desc}>{_.company.siret}</span>
              </>
            ),
          },
          {
            head: m.address,
            id: 'address',
            className: css.tdAddress,
            row: _ => <AddressComponent address={_.company.address} />,
          },
          {
            head: m.created_at,
            id: 'tokenCreation',
            row: _ => <>{formatDate(_.tokenCreation)}</>,
          },
          {
            head: m.lastNotice,
            id: 'lastNotice',
            row: _ => <>{formatDate(_.lastNotice)}</>,
          },
          {
            id: 'actions',
            row: _ => (
              <>
                <Link to={siteMap.reports({siretSirenList: [_.company.siret]})}>
                  <Tooltip title={m.reports}>
                    <IconBtn>
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
