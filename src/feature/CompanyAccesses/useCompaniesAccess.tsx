import {CompanyAccessLevel, Id} from '../../core/api'
import {SignalConsoApiSdk} from '../../App'
import {useCrudList} from '@alexandreannic/react-hooks-lib/lib'

export const useCompanyAccess = (api: SignalConsoApiSdk, siret: string) => {
  const crudAccess = useCrudList('userId', {
    r: () => api.secured.companyAccess.fetch(siret),
    u: (userId: string, level: CompanyAccessLevel) => api.secured.companyAccess.update(siret, userId, level),
    d: (userId: string) => api.secured.companyAccess.remove(siret, userId)
  })

  const crudToken = useCrudList('id', {
    c: (email: string, level: CompanyAccessLevel) => api.secured.companyAccessToken.create(siret, email, level),
    r: () => api.secured.companyAccessToken.fetch(siret),
    d: (id: Id) => api.secured.companyAccessToken.remove(siret, id)
  })

  return {crudAccess, crudToken}
}
