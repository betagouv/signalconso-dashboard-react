import { Icon } from '@mui/material'
import { sum } from 'core/helper'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { CompanyStatsPanelTitle } from './CompanyStatsPanelTitle'
import ReportSearchNavLink from '../../Report/ReportSearchNavLink'
import React from 'react'
import { ReportTag } from '../../../core/client/report/Report'

export function TagsDistribution({
  tagsDistribution,
}: {
  tagsDistribution:
    | {
        label: string
        value: number
      }[]
    | undefined
}) {
  const data = tagsDistribution?.sort((a, b) => b.value - a.value)
  const allValues = data?.map((_) => _.value)
  const sumOfAll = allValues && allValues.length ? sum(allValues) : 1
  const maxValue = allValues && allValues.length ? Math.max(...allValues) : 1

  const toReportTag = (tag: string) => {
    return Object.values(ReportTag).filter((_) => _ === (tag as ReportTag))
  }

  return (
    <CleanInvisiblePanel>
      <CompanyStatsPanelTitle bottomMargin>
        Fréquence des tags
      </CompanyStatsPanelTitle>
      <div className="flex flex-wrap gap-x-4 gap-y-2 items-baseline">
        {data &&
          (data.length === 0
            ? 'Pas de données'
            : data.map((entry) => {
                const nb = entry.value
                const ratioOfMax = nb / maxValue
                const ratioOfTotal = nb / sumOfAll
                // we use a mix of both ratios, it seems the more accurate to what we want
                const ratioUsed = (0.5 + ratioOfMax) * (0.5 + ratioOfTotal)
                // it's hard to find a formula that works well for small companies
                const lotsOfData = sumOfAll > 50
                const max = lotsOfData ? 200 : 105
                const min = lotsOfData ? 70 : 95
                const fontSizePercentage = Math.min(
                  Math.max(100 * ratioUsed, min),
                  max,
                )
                return (
                  <ReportSearchNavLink
                    className="no-underline"
                    reportSearch={{
                      withTags: toReportTag(entry.label),
                    }}
                    value={
                      <div
                        key={entry.label}
                        className="px-2 py-1 rounded-full border border-solid border-gray-300
                    flex items-center gap-1"
                      >
                        <Icon
                          style={{
                            fontSize: `${fontSizePercentage}%`,
                          }}
                          className="text-gray-500"
                        >
                          sell
                        </Icon>
                        <span
                          style={{
                            fontSize: `${fontSizePercentage}%`,
                          }}
                        >
                          {entry.label}{' '}
                          <span
                            className="text-gray-500"
                            style={{
                              fontSize: `0.8em`,
                            }}
                          >
                            ({entry.value})
                          </span>
                        </span>
                      </div>
                    }
                  />
                )
              }))}
      </div>
    </CleanInvisiblePanel>
  )
}
