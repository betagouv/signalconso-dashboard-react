import { useI18n } from 'core/i18n'

import { Icon } from '@mui/material'
import { sum } from 'core/helper'
import { CompanyPhones } from 'core/model'
import { useGetPhonesQuery } from 'core/queryhooks/companyQueryHooks'
import { useState } from 'react'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { CompanyStatsPanelTitle } from './CompanyStatsPanelTitle'

export function PhonesDistribution({ companyId }: { companyId: string }) {
  const _phones = useGetPhonesQuery(companyId)

  const { m } = useI18n()
  const phones = _phones.data

  return (
    <CleanInvisiblePanel loading={_phones.isLoading}>
      <CompanyStatsPanelTitle bottomMargin>
        Numéros appelant
      </CompanyStatsPanelTitle>
      {/* <p className="text-gray-500 mb-2">Remontés par les consommateurs.</p> */}
      {phones &&
        (phones.length === 0 ? (
          'Pas de données'
        ) : (
          <PhonesDisplay phones={phones} />
        ))}
    </CleanInvisiblePanel>
  )
}

function PhonesDisplay({ phones }: { phones: CompanyPhones }) {
  const [expanded, setExpanded] = useState<boolean>(false)
  const totalOccurences = sum(phones.map((_) => _.nbOccurences))
  const mainPhones = phones
    .filter(
      (_) => _.nbOccurences / totalOccurences > 0.01 || _.nbOccurences > 5,
    )
    .slice(0, 10)
  const displayedPhones = expanded ? phones : mainPhones
  const canToggleExpansion = mainPhones.length !== phones.length
  return (
    <>
      <ul className={`flex flex-wrap gap-x-2`}>
        {displayedPhones.map(({ phone, nbOccurences }, idx) => (
          <li
            key={phone}
            className={`flex items-start gap-1 basis-[48%] lg:basis-full xl:basis-[48%] break-words`}
          >
            <Icon fontSize="small">phone</Icon>
            <span>
              {phone}{' '}
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
              : `afficher ${phones.length - displayedPhones.length} autres numéros`}
          </button>
        </div>
      )}
    </>
  )
}
