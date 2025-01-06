import { Grid2 } from '@mui/material'
import { SelectDepartments } from '../../shared/SelectDepartments/SelectDepartments'
import { SelectActivityCode } from '../../shared/SelectActivityCode'
import React from 'react'
import { useI18n } from '../../core/i18n'
import { ScInput } from '../../shared/ScInput'
import { useActivatedCompanySearchQuery } from '../../core/queryhooks/companyQueryHooks'
import { CleanDiscreetPanel } from '../../shared/Panel/simplePanels'
import { DebouncedInput } from '../../shared/DebouncedInput'

interface CompaniesRegisteredFiltersProps {
  _companies: ReturnType<typeof useActivatedCompanySearchQuery>
  onSearchChange: (search: string) => void
  onEmailChange: (email: string) => void
}

export const CompaniesRegisteredFilters = ({
  _companies,
  onSearchChange,
  onEmailChange,
}: CompaniesRegisteredFiltersProps) => {
  const { m } = useI18n()

  return (
    <CleanDiscreetPanel noShadow>
      <Grid2 container spacing={1}>
        <Grid2 size={{ sm: 6, xs: 12 }}>
          <DebouncedInput
            value={_companies.filters.identity ?? ''}
            onChange={onSearchChange}
          >
            {(value, onChange) => (
              <ScInput
                value={value}
                placeholder={m.companiesSearchPlaceholder}
                fullWidth
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </DebouncedInput>
        </Grid2>
        <Grid2 size={{ sm: 6, xs: 12 }}>
          <SelectDepartments
            label={m.departments}
            value={_companies.filters.departments ?? []}
            onChange={(departments) =>
              _companies.updateFilters((prev) => ({ ...prev, departments }))
            }
            fullWidth
            sx={{ mr: 1 }}
          />
        </Grid2>
        <Grid2 size={{ sm: 6, xs: 12 }}>
          <SelectActivityCode
            label={m.codeNaf}
            fullWidth
            value={_companies.filters.activityCodes ?? []}
            onChange={(a, b) =>
              _companies.updateFilters((prev) => ({
                ...prev,
                activityCodes: b,
              }))
            }
          />
        </Grid2>
        <Grid2 size={{ sm: 6, xs: 12 }}>
          <DebouncedInput
            value={_companies.filters.emailsWithAccess ?? ''}
            onChange={onEmailChange}
          >
            {(value, onChange) => (
              <ScInput
                fullWidth
                label={m.email}
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </DebouncedInput>
        </Grid2>
      </Grid2>
    </CleanDiscreetPanel>
  )
}
