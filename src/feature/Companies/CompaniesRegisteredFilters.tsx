import { useI18n } from '../../core/i18n'
import { useActivatedCompanySearchQuery } from '../../core/queryhooks/companyQueryHooks'
import { DebouncedInput } from '../../shared/DebouncedInput'
import { ScInput } from '../../shared/ScInput'
import { SelectActivityCode } from '../../shared/SelectActivityCode'
import { SelectDepartments } from '../../shared/SelectDepartments/SelectDepartments'

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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2 mb-8">
        <div>
          <DebouncedInput
            value={_companies.filters.identity ?? ''}
            onChange={onSearchChange}
          >
            {(value, onChange) => (
              <ScInput
                value={value}
                label={m.companiesSearchPlaceholder}
                fullWidth
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </DebouncedInput>
        </div>
        <div>
          <SelectDepartments
            label={m.departments}
            value={_companies.filters.departments ?? []}
            onChange={(departments) =>
              _companies.updateFilters((prev) => ({ ...prev, departments }))
            }
            fullWidth
            sx={{ mr: 1 }}
          />
        </div>
        <div>
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
        </div>
        <div>
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
        </div>
      </div>
    </>
  )
}
