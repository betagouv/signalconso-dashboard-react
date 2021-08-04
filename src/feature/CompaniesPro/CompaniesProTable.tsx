import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import React, {useEffect} from 'react'
import {Panel} from '../../shared/Panel'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Icon, makeStyles, Theme, Tooltip} from '@material-ui/core'
import {utilsStyles} from '../../core/theme'
import {Fender, IconBtn} from 'mui-extension/lib'
import {ScButton} from '../../shared/Button/Button'
import {AddressComponent} from '../../shared/Address/Address'
import {siteMap} from '../../core/siteMap'
import {NavLink} from 'react-router-dom'
import {AccessLevel} from '../../core/api'

const useStyles = makeStyles((t: Theme) => ({
  tdName_label: {
    fontWeight: 'bold',
    marginBottom: -1,
  },
  tdName: {
    lineHeight: 1.4,
    maxWidth: 170,
  },
  tdName_desc: {
    fontSize: t.typography.fontSize * 0.875,
    color: t.palette.text.hint,
  },
  tdAddress: {
    maxWidth: 300,
    ...utilsStyles(t).truncate,
  },
  fender: {
    margin: `${t.spacing(1)}px auto ${t.spacing(2)}px auto`,
  },
}))

export const CompaniesProTable = () => {
  const {m} = useI18n()
  const _companies = useCompaniesContext()
  const cssUtils = useCssUtils()
  const css = useStyles()

  useEffect(() => {
    _companies.accessesByPro.fetch()
  }, [])

  return (
    <Page>
      <PageTitle>{m.myCompanies}</PageTitle>

      <Panel>
        <Datatable
          data={_companies.accessesByPro?.entity}
          loading={_companies.accessesByPro.loading}
          getRenderRowKey={_ => _.id}
          rows={[
            {
              id: '',
              className: css.tdName,
              head: m.name,
              row: _ =>
                <>
                  <span className={css.tdName_label}>{_.name}</span>
                  <br/>
                  <span className={css.tdName_desc}>{_.siret}</span>
                </>,
            },
            {
              head: m.address,
              id: 'address',
              className: css.tdAddress,
              row: _ => (
                <AddressComponent address={_.address}/>
              ),
            },
            {
              head: '',
              id: 'actions',
              className: cssUtils.txtRight,
              row: _ =>
                <>
                  {_.level === AccessLevel.ADMIN && (
                    <NavLink to={siteMap.companyAccesses(_.siret)}>
                      <Tooltip title={m.handleAccesses}>
                        <IconBtn color="primary">
                          <Icon>vpn_key</Icon>
                        </IconBtn>
                      </Tooltip>
                    </NavLink>
                  )}
                  <NavLink to={siteMap.reportsPro({siretSirenList: [_.siret]})}>
                    <Tooltip title={m.reports}>
                      <IconBtn color="primary">
                        <Icon>chevron_right</Icon>
                      </IconBtn>
                    </Tooltip>
                  </NavLink>
                </>,
            },
          ]}
          renderEmptyState={
            <Fender title={m.noCompanyFound} icon="store" className={css.fender}>
              <ScButton variant="contained" color="primary" icon="add" className={cssUtils.marginTop}>
                {m.registerACompany}
              </ScButton>
            </Fender>
          }
        />
      </Panel>
    </Page>
  )
}
