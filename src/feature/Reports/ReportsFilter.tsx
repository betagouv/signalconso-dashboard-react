import { objectKeysUnsafe } from 'core/helper'
import { UseQueryPaginateResult } from 'core/queryhooks/UseQueryPaginate'
import { SelectTagsMenuValues } from 'shared/SelectTags/SelectTagsMenu'
import { ReportSearchResult } from '../../core/client/report/Report'
import { useI18n } from '../../core/i18n'
import { Paginate, PaginatedFilters, ReportSearch } from '../../core/model'
import { DebouncedInput } from '../../shared/DebouncedInput'
import { PeriodPicker } from '../../shared/PeriodPicker'
import { ScInput } from '../../shared/ScInput'
import { SelectDepartments } from '../../shared/SelectDepartments/SelectDepartments'
import { SelectTags } from '../../shared/SelectTags/SelectTags'
import { TrueFalseNullRow } from './AdvancedReportsFilter'
import { PeriodPickerWithPredefinedRanges } from '../../shared/PeriodPickerWithPredefinedRanges'

type ReportsGridProps = {
  _reports: UseQueryPaginateResult<
    ReportSearch & PaginatedFilters,
    Paginate<ReportSearchResult>,
    unknown
  >
  onDetailsChange: (details: string) => void
  onSiretSirenChange: (siretSirenList: string[]) => void
  onEmailChange: (email: string) => void
  connectedUser: { isAdmin: boolean }

  tags: SelectTagsMenuValues
}

export const ReportsFilter: React.FC<ReportsGridProps> = ({
  _reports,
  onDetailsChange,
  onSiretSirenChange,
  onEmailChange,
  connectedUser,

  tags,
}) => {
  const { m } = useI18n()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div>
        <SelectDepartments
          label={m.departments}
          value={_reports.filters.departments}
          onChange={(departments) =>
            _reports.updateFilters((prev) => ({ ...prev, departments }))
          }
          sx={{ mr: 1 }}
          fullWidth
        />
      </div>
      <div>
        <PeriodPickerWithPredefinedRanges
          start={_reports.filters.start}
          end={_reports.filters.end}
          onChange={(start, end) =>
            _reports.updateFilters((prev) => ({ ...prev, start, end }))
          }
        />
      </div>
      <div>
        <DebouncedInput
          value={_reports.filters.details ?? ''}
          onChange={onDetailsChange}
        >
          {(value, onChange) => (
            <ScInput
              label={m.keywords}
              fullWidth
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </DebouncedInput>
      </div>
      <div>
        <SelectTags
          label={m.tags}
          fullWidth
          value={tags}
          onChange={(e) =>
            _reports.updateFilters((prev) => ({
              ...prev,
              withTags: objectKeysUnsafe(e).filter(
                (tag) => e[tag] === 'included',
              ),
              withoutTags: objectKeysUnsafe(e).filter(
                (tag) => e[tag] === 'excluded',
              ),
            }))
          }
        />
      </div>
      <div className="mt-1">
        <TrueFalseNullRow
          label={m.siretOrSirenFound}
          value={_reports.filters.hasCompany ?? null}
          onChange={(hasCompany) =>
            _reports.updateFilters((prev) => ({
              ...prev,
              hasCompany: hasCompany ?? undefined,
            }))
          }
          dropdownArrow
        />
        {_reports.filters.hasCompany === true && (
          <DebouncedInput
            value={_reports.filters.siretSirenList ?? []}
            onChange={onSiretSirenChange}
          >
            {(value, onChange) => (
              <ScInput
                label={m.siretOrSiren}
                fullWidth
                value={value}
                onChange={(e) => onChange([e.target.value])}
              />
            )}
          </DebouncedInput>
        )}
      </div>
      {connectedUser.isAdmin && (
        <div>
          <DebouncedInput
            value={_reports.filters.email ?? ''}
            onChange={onEmailChange}
          >
            {(value, onChange) => (
              <ScInput
                label={m.emailConsumer}
                fullWidth
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </DebouncedInput>
        </div>
      )}
    </div>
  )
}
