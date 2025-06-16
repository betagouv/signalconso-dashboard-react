import React from 'react'
import {
  IdentificationStatus,
  InvestigationStatus,
} from '../../core/client/website/Website'
import { useI18n } from '../../core/i18n'
import { Label } from '../../shared/Label'
import { ScMultiSelect } from '../../shared/Select/MultiSelect'
import { ScMenuItem } from '../MenuItem/MenuItem'
import { CleanDiscreetPanel } from '../../shared/Panel/simplePanels'
import { TrueFalseNullRow } from '../Reports/AdvancedReportsFilter'
import { DebouncedInput } from '../../shared/DebouncedInput'
import { ScInput } from '../../shared/ScInput'
import { PeriodPicker } from '../../shared/PeriodPicker'
import { useWebsiteWithCompanySearchQuery } from '../../core/queryhooks/websiteQueryHooks'
import { PeriodPickerWithPredefinedRanges } from '../../shared/PeriodPickerWithPredefinedRanges'

interface WebsitesFiltersProps {
  _websiteWithCompany: ReturnType<typeof useWebsiteWithCompanySearchQuery>
  onHostChange: (host: string) => void
}

const identificationStatusToBoolean = (
  identificationStatuses?: IdentificationStatus[],
) => {
  if (identificationStatuses?.length === 1) {
    return identificationStatuses[0] === IdentificationStatus.Identified
  }
  return null
}

export const WebsitesFilters = ({
  _websiteWithCompany,
  onHostChange,
  ...props
}: WebsitesFiltersProps) => {
  const { m } = useI18n()

  return (
    <CleanDiscreetPanel noShadow>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div>
          <DebouncedInput
            value={_websiteWithCompany.filters.host ?? ''}
            onChange={onHostChange}
          >
            {(value, onChange) => (
              <ScInput
                value={value}
                label={m.searchByHost + '...'}
                fullWidth
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </DebouncedInput>
        </div>
        <div>
          <PeriodPickerWithPredefinedRanges
            start={_websiteWithCompany.filters.start}
            end={_websiteWithCompany.filters.end}
            onChange={(start, end) =>
              _websiteWithCompany.updateFilters((prev) => ({
                ...prev,
                start,
                end,
              }))
            }
          />
        </div>
        <div>
          <ScMultiSelect
            fullWidth
            label={m.investigation}
            withSelectAll
            value={_websiteWithCompany.filters.investigationStatus ?? []}
            onChange={(investigationStatus) =>
              _websiteWithCompany.updateFilters((prev) => ({
                ...prev,
                investigationStatus: investigationStatus ?? null,
              }))
            }
            renderValue={(investigationStatus) =>
              `(${investigationStatus.length}) ${investigationStatus
                .map((status) => m.InvestigationStatusDesc[status])
                .join(',')}`
            }
          >
            {Object.values(InvestigationStatus).map((investigationStatus) => (
              <ScMenuItem
                withCheckbox
                key={investigationStatus}
                value={investigationStatus}
              >
                <Label dense {...props}>
                  {m.InvestigationStatusDesc[investigationStatus]}
                </Label>
              </ScMenuItem>
            ))}
          </ScMultiSelect>
        </div>
        <div>
          <TrueFalseNullRow
            label="Établissement identifié"
            value={identificationStatusToBoolean(
              _websiteWithCompany.filters.identificationStatus,
            )}
            onChange={(v) =>
              _websiteWithCompany.updateFilters((prev) => ({
                ...prev,
                identificationStatus:
                  v === true
                    ? [IdentificationStatus.Identified]
                    : v === false
                      ? [IdentificationStatus.NotIdentified]
                      : undefined,
              }))
            }
          />
        </div>
        <div>
          <TrueFalseNullRow
            label="Établissement ouvert"
            value={_websiteWithCompany.filters.isOpen}
            onChange={(open) =>
              _websiteWithCompany.updateFilters((prev) => ({
                ...prev,
                isOpen: open ?? null,
              }))
            }
          />
        </div>
        <div>
          <TrueFalseNullRow
            label="Marketplace"
            value={_websiteWithCompany.filters.isMarketplace}
            onChange={(isMarketplace) =>
              _websiteWithCompany.updateFilters((prev) => ({
                ...prev,
                isMarketplace: isMarketplace ?? null,
              }))
            }
          />
        </div>
      </div>
    </CleanDiscreetPanel>
  )
}
