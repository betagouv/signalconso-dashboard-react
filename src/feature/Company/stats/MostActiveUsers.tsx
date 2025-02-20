import { Icon } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useApiContext } from 'core/context/ApiContext'
import { map } from 'core/helper'
import { siteMap } from 'core/siteMap'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { CompanyStatsPanelTitle } from './CompanyStatsPanelTitle'
import {Link} from "@tanstack/react-router";

export const MostActiveUsers = ({
  companyId,
  siret,
}: {
  companyId: string
  siret: string
}) => {
  const { api } = useApiContext()
  const _mostActive = useQuery({
    queryKey: ['companyAccess_getMostActives', siret],
    queryFn: () => api.secured.companyAccess.getMostActives(siret),
  })

  return (
    <CleanInvisiblePanel loading={_mostActive.isLoading}>
      <CompanyStatsPanelTitle bottomMargin>
        Utilisateurs principaux
      </CompanyStatsPanelTitle>
      {map(_mostActive.data, (users) => {
        if (users.length === 0) {
          return <p>Aucun compte créé.</p>
        }
        return (
          <div className="flex flex-col gap-2">
            <ul className="space-y-1">
              {users.map((user, idx) => {
                return (
                  <li key={user.userId} className="">
                    <div className="flex items-center gap-1">
                      <Icon fontSize="small">person_outline</Icon>
                      <b className="">
                        {user.firstName} {user.lastName}
                      </b>

                      <span className="text-gray-500 ml-1">
                        ({user.nbResponses} réponses)
                      </span>
                    </div>
                    <div className="text-sm">{user.email}</div>
                  </li>
                )
              })}
            </ul>
            <Link
              className={`self-center`}
              to={siteMap.logged.company(companyId).accesses.valueAbsolute}
            >
              Voir tous les utilisateurs
            </Link>
          </div>
        )
      })}
    </CleanInvisiblePanel>
  )
}
