import { Grid2 } from '@mui/material'
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

interface WebsitesFiltersProps {
  _websiteWithCompany: ReturnType<typeof useWebsiteWithCompanySearchQuery>
  onHostChange: (host: string) => void
}

export const WebsitesFilters = ({
  _websiteWithCompany,
  onHostChange,
  ...props
}: WebsitesFiltersProps) => {
  const { m } = useI18n()

  return (
    <CleanDiscreetPanel noShadow>
      <Grid2 container spacing={1}>
        <Grid2 size={{ sm: 6, xs: 12 }}>
          <DebouncedInput
            value={_websiteWithCompany.filters.host ?? ''}
            onChange={onHostChange}
          >
            {(value, onChange) => (
              <ScInput
                value={value}
                placeholder={m.searchByHost + '...'}
                fullWidth
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </DebouncedInput>
        </Grid2>
        <Grid2 size={{ sm: 6, xs: 12 }}>
          <DebouncedInput<[Date | undefined, Date | undefined]>
            value={[
              _websiteWithCompany.filters.start,
              _websiteWithCompany.filters.end,
            ]}
            onChange={([start, end]) => {
              _websiteWithCompany.updateFilters((prev) => ({
                ...prev,
                start,
                end,
              }))
            }}
          >
            {(value, onChange) => (
              <PeriodPicker
                value={value}
                onChange={onChange}
                sx={{ mr: 1 }}
                fullWidth
              />
            )}
          </DebouncedInput>
        </Grid2>
        <Grid2 size={{ sm: 6, xs: 12 }}>
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
        </Grid2>
        <Grid2 size={{ sm: 6, xs: 12 }}>
          <ScMultiSelect
            fullWidth
            label={m.kind}
            value={_websiteWithCompany.filters.identificationStatus ?? []}
            withSelectAll
            onChange={(identificationStatus) =>
              _websiteWithCompany.updateFilters((prev) => ({
                ...prev,
                identificationStatus: identificationStatus ?? null,
              }))
            }
            renderValue={(identificationStatus) =>
              `(${identificationStatus.length}) ${identificationStatus
                .map((status) => m.IdentificationStatusDesc[status])
                .join(',')}`
            }
          >
            {Object.values(IdentificationStatus).map((kind) => (
              <ScMenuItem withCheckbox key={kind} value={kind}>
                <Label dense {...props}>
                  {m.IdentificationStatusDesc[kind]}
                </Label>
              </ScMenuItem>
            ))}
          </ScMultiSelect>
        </Grid2>
        <Grid2 size={{ sm: 6, xs: 12 }}>
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
        </Grid2>
        <Grid2 size={{ sm: 6, xs: 12 }}>
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
        </Grid2>
      </Grid2>
    </CleanDiscreetPanel>
  )
}
