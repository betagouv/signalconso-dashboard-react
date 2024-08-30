import { Box, Grid, Icon } from '@mui/material'
import { UseQueryPaginateResult } from 'core/queryhooks/UseQueryPaginate'
import { SelectTagsMenuValues } from 'shared/SelectTags/SelectTagsMenu'
import { Enum } from '../../alexlibs/ts-utils'
import { ReportSearchResult } from '../../core/client/report/Report'
import { useI18n } from '../../core/i18n'
import { Paginate, PaginatedFilters, ReportSearch } from '../../core/model'
import { DebouncedInput } from '../../shared/DebouncedInput'
import { PeriodPicker } from '../../shared/PeriodPicker'
import { ScInput } from '../../shared/ScInput'
import { SelectDepartments } from '../../shared/SelectDepartments/SelectDepartments'
import { SelectTags } from '../../shared/SelectTags/SelectTags'
import { TrueFalseNullRow } from './AdvancedReportsFilter'

const TrueLabel = () => {
  const { m } = useI18n()
  return (
    <>
      {m.yes}{' '}
      <Icon fontSize="inherit" sx={{ mr: '-4px' }}>
        arrow_drop_down
      </Icon>
    </>
  )
}

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
    <Grid container spacing={1}>
      <Grid item sm={6} xs={12}>
        <SelectDepartments
          label={m.departments}
          value={_reports.filters.departments}
          onChange={(departments) =>
            _reports.updateFilters((prev) => ({ ...prev, departments }))
          }
          sx={{ mr: 1 }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DebouncedInput<[Date | undefined, Date | undefined]>
          value={[_reports.filters.start, _reports.filters.end]}
          onChange={([start, end]) => {
            _reports.updateFilters((prev) => ({ ...prev, start, end }))
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
      </Grid>
      <Grid item xs={12} md={6}>
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
      </Grid>
      <Grid item xs={12} md={6}>
        <SelectTags
          label={m.tags}
          fullWidth
          value={tags}
          onChange={(e) =>
            _reports.updateFilters((prev) => ({
              ...prev,
              withTags: Enum.keys(e).filter((tag) => e[tag] === 'included'),
              withoutTags: Enum.keys(e).filter((tag) => e[tag] === 'excluded'),
            }))
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
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
        </Box>
      </Grid>
      {connectedUser.isAdmin && (
        <Grid item xs={12} md={6}>
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
        </Grid>
      )}
    </Grid>
  )
}
