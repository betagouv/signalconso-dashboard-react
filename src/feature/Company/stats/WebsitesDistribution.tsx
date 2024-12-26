import { useI18n } from 'core/i18n'

import { Icon } from '@mui/material'
import { UseQueryResult } from '@tanstack/react-query'
import { ApiError } from 'core/client/ApiClient'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'

export function WebsitesDistribution({
  _hosts,
}: {
  _hosts: UseQueryResult<string[], ApiError>
}) {
  const { m } = useI18n()
  const hosts = _hosts.data
  return (
    <CleanInvisiblePanel loading={_hosts.isLoading}>
      <h2 className="font-bold text-2xl mb-2">{m.websites}</h2>
      {hosts &&
        (hosts.length === 0 ? (
          'Pas de données'
        ) : (
          <ul className="grid grid-cols-2">
            {hosts.map((host, i) => (
              <li key={i} className="flex gap-1 items-center">
                <Icon fontSize="small">public</Icon>
                {host}
              </li>
            ))}
          </ul>
        ))}
    </CleanInvisiblePanel>
  )
}
