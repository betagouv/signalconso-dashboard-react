import {useI18n} from '../../core/i18n'

import {Box, Grid, Icon} from '@mui/material'
import React, {useCallback, useEffect} from 'react'
import {Enum} from '../../alexlibs/ts-utils'
import {ReportStatus, ReportTag} from '../../core/client/report/Report'
import {useLogin} from '../../core/context/LoginContext'
import {cleanObject} from '../../core/helper'
import compose from '../../core/helper/compose'
import {
  mapArrayFromQuerystring,
  mapBooleanFromQueryString,
  mapDateFromQueryString,
  mapDatesToQueryString,
  useQueryString,
} from '../../core/helper/useQueryString'
import {ReportResponseTypes, ReportSearch, ResponseEvaluation} from '../../core/model'
import {DebouncedInput} from '../../shared/DebouncedInput'
import {ScInput} from '../../shared/ScInput'
import {PeriodPicker} from '../../shared/PeriodPicker'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'
import {SelectTags} from '../../shared/SelectTags/SelectTags'
import {SelectTagsMenuValues} from '../../shared/SelectTags/SelectTagsMenu'
import {TrueFalseNull} from '../../shared/TrueFalseNull'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'

const TrueLabel = () => {
  const {m} = useI18n()
  return (
    <>
      {m.yes}{' '}
      <Icon fontSize="inherit" sx={{mr: '-4px'}}>
        arrow_drop_down
      </Icon>
    </>
  )
}

interface ReportSearchQs {
  readonly departments?: string[] | string
  readonly tags?: ReportTag[] | ReportTag
  readonly companyCountries?: string[] | string
  readonly siretSirenList?: string[] | string
  readonly activityCodes?: string[] | string
  start?: string
  end?: string
  email?: string
  websiteURL?: string
  phone?: string
  category?: string
  status?: string[]
  details?: string
  hasWebsite?: boolean
  hasPhone?: boolean
  hasCompany?: boolean
  hasForeignCountry?: boolean
  hasEvaluation?: boolean
  evaluation?: ResponseEvaluation[]
  offset: number
  limit: number
}
const ReportsFilter = () => {
  const {m} = useI18n()
  const {connectedUser} = useLogin()

  const queryString = useQueryString<Partial<ReportSearch>, Partial<ReportSearchQs>>({
    toQueryString: mapDatesToQueryString,
    fromQueryString: compose(
      mapDateFromQueryString,
      mapArrayFromQuerystring([
        'status',
        'departments',
        'tags',
        'companyCountries',
        'siretSirenList',
        'activityCodes',
        'evaluation',
      ]),
      mapBooleanFromQueryString(['hasCompany', 'hasForeignCountry', 'hasPhone', 'hasWebsite', 'hasEvaluation']),
    ),
  })

  const _reports = useReportSearchQuery({offset: 0, limit: 10, ...queryString.get()})

  useEffect(() => {
    queryString.update(cleanObject(_reports.filters))
  }, [_reports.filters])

  const tags: SelectTagsMenuValues = {}
  _reports.filters.withTags?.forEach(tag => {
    tags[tag] = 'included'
  })
  _reports.filters.withoutTags?.forEach(tag => {
    tags[tag] = 'excluded'
  })

  const proResponseToStatus = {
    [ReportResponseTypes.Accepted]: ReportStatus.PromesseAction,
    [ReportResponseTypes.NotConcerned]: ReportStatus.MalAttribue,
    [ReportResponseTypes.Rejected]: ReportStatus.Infonde,
  }

  const css = {
    trueFalseNullBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mt: 1,
    },
    trueFalseNullLabel: {
      color: 'rgba(0, 0, 0, 0.6)',
      ml: 1,
    },
  }

  // TRELLO-1728 The object _reports change all the time.
  // If we put it in dependencies, it causes problems with the debounce,
  // and the search input "stutters" when typing fast
  const onDetailsChange = useCallback((details: string) => {
    _reports.updateFilters(prev => ({...prev, details}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onSiretSirenChange = useCallback((siretSirenList: string[]) => {
    _reports.updateFilters(prev => ({...prev, siretSirenList}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onEmailChange = useCallback((email: string) => {
    _reports.updateFilters(prev => ({...prev, email}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={1}>
      <Grid item sm={6} xs={12}>
        <SelectDepartments
          label={m.departments}
          value={_reports.filters.departments}
          onChange={departments => _reports.updateFilters(prev => ({...prev, departments}))}
          sx={{mr: 1}}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DebouncedInput<[Date | undefined, Date | undefined]>
          value={[_reports.filters.start, _reports.filters.end]}
          onChange={([start, end]) => {
            _reports.updateFilters(prev => ({...prev, start, end}))
          }}
        >
          {(value, onChange) => <PeriodPicker value={value} onChange={onChange} sx={{mr: 1}} fullWidth />}
        </DebouncedInput>
      </Grid>
      <Grid item xs={12} md={6}>
        <DebouncedInput value={_reports.filters.details ?? ''} onChange={onDetailsChange}>
          {(value, onChange) => <ScInput label={m.keywords} fullWidth value={value} onChange={e => onChange(e.target.value)} />}
        </DebouncedInput>
      </Grid>
      <Grid item xs={12} md={6}>
        <SelectTags
          label={m.tags}
          fullWidth
          value={tags}
          onChange={e =>
            _reports.updateFilters(prev => ({
              ...prev,
              withTags: Enum.keys(e).filter(tag => e[tag] === 'included'),
              withoutTags: Enum.keys(e).filter(tag => e[tag] === 'excluded'),
            }))
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <Box sx={css.trueFalseNullBox}>
            <Box sx={css.trueFalseNullLabel}>{m.siretOrSirenFound}</Box>
            <TrueFalseNull
              label={{
                true: <TrueLabel />,
              }}
              sx={{flexBasis: '50%'}}
              value={_reports.filters.hasCompany ?? null}
              onChange={hasCompany =>
                _reports.updateFilters(prev => ({
                  ...prev,
                  hasCompany: hasCompany ?? undefined,
                }))
              }
            />
          </Box>
          {_reports.filters.hasCompany === true && (
            <DebouncedInput value={_reports.filters.siretSirenList ?? []} onChange={onSiretSirenChange}>
              {(value, onChange) => (
                <ScInput label={m.siretOrSiren} fullWidth value={value} onChange={e => onChange([e.target.value])} />
              )}
            </DebouncedInput>
          )}
        </Box>
      </Grid>
      {connectedUser.isAdmin && (
        <Grid item xs={12} md={6}>
          <DebouncedInput value={_reports.filters.email ?? ''} onChange={onEmailChange}>
            {(value, onChange) => (
              <ScInput label={m.emailConsumer} fullWidth value={value} onChange={e => onChange(e.target.value)} />
            )}
          </DebouncedInput>
        </Grid>
      )}
    </Grid>
  )
}

export default ReportsFilter
