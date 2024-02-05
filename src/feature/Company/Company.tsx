import {useParams} from 'react-router'
import {Page} from 'shared/Page'
import {useLogin} from 'core/context/LoginContext'
import {Id} from '../../core/model'
import {useGetCompanyByIdQuery} from '../../core/queryhooks/companyQueryHooks'

import {ProUserComponent} from './ProUserComponent'
import {NonProUserComponent} from './NonProUserComponent'

export const CompanyComponent = () => {
  const {id} = useParams<{id: Id}>()
  const {connectedUser} = useLogin()
  const _companyById = useGetCompanyByIdQuery(id)

  const company = _companyById.data

  return (
    <>
      {connectedUser.isPro ? (
        <ProUserComponent id={id} connectedUser={connectedUser} company={company} />
      ) : (
        <NonProUserComponent id={id} connectedUser={connectedUser} company={company} />
      )}
    </>
  )
}
