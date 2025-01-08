import { useI18n } from 'core/i18n'

import { Icon } from '@mui/material'
import { UseQueryResult } from '@tanstack/react-query'
import { ApiError } from 'core/client/ApiClient'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { CompanyStatsPanelTitle } from './CompanyStatsPanelTitle'

export function WebsitesDistribution({
  _hosts,
}: {
  _hosts: UseQueryResult<string[], ApiError>
}) {
  const { m } = useI18n()
  const hosts = _hosts.data
  return (
    <CleanInvisiblePanel loading={_hosts.isLoading}>
      <CompanyStatsPanelTitle bottomMargin>{m.websites}</CompanyStatsPanelTitle>
      {hosts &&
        (hosts.length === 0 ? (
          'Pas de données'
        ) : (
          <ul className={`flex flex-wrap gap-x-2`}>
            {hosts.map((host, i) => (
              <li
                key={i}
                className={`flex items-start gap-1 basis-[48%] lg:basis-full xl:basis-[48%] break-words`}
              >
                <Icon fontSize="small">public</Icon>
                {host}
              </li>
            ))}
          </ul>
        ))}
    </CleanInvisiblePanel>
  )
}
