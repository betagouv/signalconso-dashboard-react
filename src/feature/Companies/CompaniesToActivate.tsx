import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {CompanyToActivate, Id} from '../../core/api'
import React, {useEffect} from 'react'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {Checkbox, Icon, makeStyles, Theme} from '@material-ui/core'
import {utilsStyles} from '../../core/theme'
import {Confirm, Fender, IconBtn} from 'mui-extension/lib'
import {Link} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {usePersistentState} from 'react-persistent-state'
import {useSetState} from '@alexandreannic/react-hooks-lib/lib'
import {ScButton} from '../../shared/Button/Button'
import {useToast} from '../../core/toast'

const useStyles = makeStyles((t: Theme) => ({
  tdName_label: {
    fontWeight: 'bold',
    marginBottom: -1,
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
    paddingTop: t.spacing(.5),
    paddingBottom: t.spacing(.5),
    fontSize: utilsStyles(t).fontSize.small,
    color: t.palette.text.secondary,
    maxWidth: 300,
    ...utilsStyles(t).truncate,
  },
  fender: {
    margin: `${t.spacing(1)}px auto ${t.spacing(2)}px auto`,
  }
}))

export const CompaniesToActivate = () => {
  const {m, formatLargeNumber, formatDate} = useI18n()
  const _companies = useCompaniesContext()
  const _companiesToActivate = _companies.toActivate
  const cssUtils = useUtilsCss()
  const css = useStyles()

  const [selectedCompanies, setSelectedCompanies] = usePersistentState<string[]>([], 'CompaniesToActivate')
  const selectedCompaniesSet = useSetState(selectedCompanies)
  const {toastError} = useToast()

  useEffect(() => {
    _companiesToActivate.fetch()
  }, [])

  const toggleSelectedCompany = (companyId: Id) => {
    selectedCompaniesSet.has(companyId) ? selectedCompaniesSet.delete(companyId) : selectedCompaniesSet.add(companyId)
    setSelectedCompanies(selectedCompaniesSet.toArray())
  }

  const allChecked = selectedCompaniesSet.size === (_companiesToActivate.list?.data.length ?? 0)

  const selectAll = () => {
    if (selectedCompaniesSet.size === 0 && !allChecked)
      selectedCompaniesSet.reset(_companiesToActivate.list?.data.map(_ => _.company.id))
    else
      selectedCompaniesSet.clear()
    setSelectedCompanies(selectedCompaniesSet.toArray())
  }

  const unselectAll = () => {
    selectedCompaniesSet.clear()
    setSelectedCompanies(selectedCompaniesSet.toArray())
  }

  const confirmCompaniesPosted = () => {
    _companies.confirmCompaniesPosted.fetch()(selectedCompaniesSet.toArray())
      .then(() => {
        _companiesToActivate.fetch({clean: false})
      })
      .then(unselectAll)
      .catch(toastError)
  }

  return (
    <Panel>
      <Datatable<CompanyToActivate>
        header={
          <>
            <ScButton
              disabled={_companiesToActivate.fetching || selectedCompaniesSet.size === 0}
              loading={_companies.downloadActivationDocument.loading}
              color="primary" variant="outlined" icon="file_download" className={cssUtils.marginRight}
              onClick={() => _companies.downloadActivationDocument.fetch()(selectedCompaniesSet.toArray())
                .catch(toastError)
              }
            >
              {m.download}
            </ScButton>
            <Confirm
              title={m.validateLetterSentTitle}
              content={m.validateLetterSentDesc}
              cancelLabel={m.cancel}
              confirmLabel={m.confirm}
              onConfirm={confirmCompaniesPosted}
            >
              <ScButton
                disabled={_companiesToActivate.fetching || selectedCompaniesSet.size === 0}
                loading={_companies.confirmCompaniesPosted.loading}
                color="error" variant="contained" icon="check_circle">
                {m.validateLetterSent}
              </ScButton>
            </Confirm>
          </>
        }
        loading={_companiesToActivate.fetching}
        data={_companiesToActivate.list?.data}
        offset={_companiesToActivate.filters.offset}
        limit={_companiesToActivate.filters.limit}
        total={_companiesToActivate.list?.totalSize}
        onPaginationChange={pagination => _companiesToActivate.updateFilters(prev => ({...prev, ...pagination}))}
        getRenderRowKey={_ => _.company.id}
        showColumnsToggle={true}
        rowsPerPageOptions={[5, 10, 25, 100, 500]}
        rows={[
          {
            head: <Checkbox
              indeterminate={!allChecked && selectedCompaniesSet.size > 0}
              checked={allChecked}
              disabled={_companiesToActivate.fetching} onClick={selectAll}
            />,
            name: 'select',
            row: _ =>
              <Checkbox
                checked={selectedCompaniesSet.has(_.company.id)}
                onClick={() => toggleSelectedCompany(_.company.id)}
              />
          },
          {
            head: m.name,
            className: css.tdName,
            name: 'siret',
            row: _ =>
              <>
                <span className={css.tdName_label}>{_.company.name}</span>
                <br/>
                <span className={css.tdName_desc}>{_.company.siret}</span>
              </>
          },
          {
            head: m.address,
            name: 'address',
            className: css.tdAddress,
            row: _ => (
              <span>{_.company.address.split(' - ').map((_, i) => <React.Fragment key={i}>{_}<br/></React.Fragment>)}</span>
            )
          },
          {
            head: m.created_at,
            name: 'tokenCreation',
            row: _ =>
              <>{formatDate(_.tokenCreation)}</>
          },
          {
            head: m.lastNotice,
            name: 'lastNotice',
            row: _ =>
              <>{formatDate(_.lastNotice)}</>

          },
          {
            name: 'actions',
            row: _ =>
              <>
                <Link to={siteMap.reports({siretSirenList: [_.company.siret]})}>
                  <IconBtn>
                    <Icon>chevron_right</Icon>
                  </IconBtn>
                </Link>
              </>
          }
        ]}
        renderEmptyState={
          <Fender title={m.noCompanyFound} icon="store" description={m.noDataAtm} className={css.fender}>
          </Fender>
        }/>
    </Panel>
  )
}
