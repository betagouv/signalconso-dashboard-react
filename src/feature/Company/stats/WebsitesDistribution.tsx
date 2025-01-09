import { useI18n } from 'core/i18n'

import { Icon } from '@mui/material'
import { sum } from 'core/helper'
import { CompanyHosts } from 'core/model'
import { useGetHostsQuery } from 'core/queryhooks/companyQueryHooks'
import { useState } from 'react'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { CompanyStatsPanelTitle } from './CompanyStatsPanelTitle'

export function WebsitesDistribution({ companyId }: { companyId: string }) {
  const _hosts = useGetHostsQuery(companyId)

  const { m } = useI18n()
  const hosts = _hosts.data

  return (
    <CleanInvisiblePanel loading={_hosts.isLoading}>
      <CompanyStatsPanelTitle>{m.websites}</CompanyStatsPanelTitle>
      <p className="text-gray-500 mb-2">Remontés par les consommateurs.</p>
      {hosts &&
        (hosts.length === 0 ? (
          'Pas de données'
        ) : (
          <HostsDisplay hosts={hosts} />
        ))}
    </CleanInvisiblePanel>
  )
}

function HostsDisplay({ hosts }: { hosts: CompanyHosts }) {
  const [expanded, setExpanded] = useState<boolean>(false)
  const totalOccurences = sum(hosts.map((_) => _.nbOccurences))
  const mainHosts = hosts.filter(
    (_) => _.nbOccurences / totalOccurences > 0.01 || _.nbOccurences > 20,
  )
  const displayedHosts = expanded ? hosts : mainHosts
  const canToggleExpansion = mainHosts.length !== hosts.length
  return (
    <>
      <ul className={`flex flex-wrap gap-x-2`}>
        {displayedHosts.map(({ host, nbOccurences }, idx) => (
          <li
            key={host}
            className={`flex items-start gap-1 basis-[48%] lg:basis-full xl:basis-[48%] break-words`}
          >
            <Icon fontSize="small">public</Icon>
            <span>
              {host}{' '}
              <span className="text-gray-500 text-sm">
                ({nbOccurences}
                {idx === 0 ? ' signalements' : ''})
              </span>
            </span>
          </li>
        ))}
      </ul>
      {canToggleExpansion && (
        <div className="flex justify-center mt-2">
          <button
            className="underline flex items-center"
            onClick={() => {
              setExpanded((x) => !x)
            }}
          >
            <Icon>{expanded ? 'unfold_less' : 'unfold_more'}</Icon>
            {expanded
              ? 'réduire'
              : `afficher ${hosts.length - displayedHosts.length} autres sites`}
          </button>
        </div>
      )}
    </>
  )
}
