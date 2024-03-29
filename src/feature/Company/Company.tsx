import {useParams} from 'react-router'

import {useLogin} from 'core/context/LoginContext'
import {Id} from '../../core/model'
import {useGetCompanyByIdQuery} from '../../core/queryhooks/companyQueryHooks'
import {CompanyStatsPro} from './CompanyStatsPro'
import {CompanyStats} from './CompanyStats'

export const CompanyComponent = () => {
  const {id} = useParams<{id: Id}>()

  const {connectedUser} = useLogin()
  const _companyById = useGetCompanyByIdQuery(id)

  const company = _companyById.data

  return (
    <>
      {id &&
        (connectedUser.isPro ? (
          <CompanyStatsPro id={id} connectedUser={connectedUser} company={company} />
        ) : (
          <CompanyStats id={id} connectedUser={connectedUser} company={company} />
        ))}
    </>
  )
}
