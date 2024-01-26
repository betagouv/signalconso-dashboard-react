import {useEffectFn, useMemoFn} from '../../alexlibs/react-hooks-lib'
import {useParams} from 'react-router'
import {Page} from 'shared/Page'
import {useLogin} from 'core/context/LoginContext'
import {Id} from '../../core/model'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import {useGetCompanyByIdQuery} from '../../core/queryhooks/companyQueryHooks'

import {ProUserComponent} from './ProUserComponent'
import {NonProUserComponent} from './NonProUserComponent'

export const CompanyComponent = () => {
  const {id} = useParams<{id: Id}>()
  const {connectedUser} = useLogin()
  const _companyById = useGetCompanyByIdQuery(id)

  const company = _companyById.data

  const _reports = useReportSearchQuery({hasCompany: true, offset: 0, limit: 5}, false)

  useEffectFn(company, _ => {
    _reports.updateFilters({hasCompany: true, siretSirenList: [_.siret], offset: 0, limit: 5})
    _reports.enable()
  })

  return <Page loading={_companyById.isLoading}>{connectedUser.isPro ? <ProUserComponent /> : <NonProUserComponent />}</Page>
}
