import {useI18n} from '../../core/i18n'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {Box, Grid, Icon, MenuItem} from '@mui/material'
import {styled} from '@mui/material/styles'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useSetState} from '../../alexlibs/react-hooks-lib'
import {Enum} from '../../alexlibs/ts-utils'
import {Report, ReportingDateLabel, ReportStatus, ReportTag} from '../../core/client/report/Report'
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
import {Id, ReportResponseTypes, ReportSearch, ResponseEvaluation} from '../../core/model'
import {ConsumerReviewLabel} from '../../shared/ConsumerReviewLabel'
import {DebouncedInput} from '../../shared/DebouncedInput'
import {ScInput} from '../../shared/ScInput'
import {ScMenuItem} from '../../shared/ScMenuItem'
import {ProResponseLabel} from '../../shared/ProResponseLabel'
import {ReportStatusLabel} from '../../shared/ReportStatus'
import {ScMultiSelect} from '../../shared/Select/MultiSelect'
import {ScSelect} from '../../shared/Select/Select'
import {SelectActivityCode} from '../../shared/SelectActivityCode'
import {SelectCountries} from '../../shared/SelectCountries/SelectCountries'
import {SelectTagsMenuValues} from '../../shared/SelectTags/SelectTagsMenu'
import {TrueFalseNull} from '../../shared/TrueFalseNull'
import {useMutation} from '@tanstack/react-query'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import {useCategoriesQuery} from '../../core/queryhooks/constantQueryHooks'

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

const AdvancedReportsFilter = () => {
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

  const _category = useCategoriesQuery()

  const [proResponseFilter, setProResponseFilter] = useState<ReportResponseTypes[]>([])

  const proResponseToStatus = {
    [ReportResponseTypes.Accepted]: ReportStatus.PromesseAction,
    [ReportResponseTypes.NotConcerned]: ReportStatus.MalAttribue,
    [ReportResponseTypes.Rejected]: ReportStatus.Infonde,
  }

  const onChangeStatus = (status: ReportStatus[]) => {
    const responses = status.flatMap(reportStatus => {
      switch (reportStatus) {
        case ReportStatus.PromesseAction:
          return [ReportResponseTypes.Accepted]
        case ReportStatus.MalAttribue:
          return [ReportResponseTypes.NotConcerned]
        case ReportStatus.Infonde:
          return [ReportResponseTypes.Rejected]
        default:
          return []
      }
    })
    setProResponseFilter(responses)
    _reports.updateFilters(prev => ({...prev, status}))
  }

  const onChangeProResponseFilter = (responses: ReportResponseTypes[]) => {
    setProResponseFilter(responses)
    const status = responses.length === 0 ? Report.respondedStatus : responses.map(_ => proResponseToStatus[_])
    _reports.updateFilters(prev => ({...prev, status}))
  }

  const hasProResponse =
    _reports.filters.status?.length === 0
      ? null
      : _reports.filters.status?.every(status => Report.respondedStatus.includes(status))
      ? true
      : _reports.filters.status?.every(status => Report.notRespondedStatus.includes(status))
      ? false
      : null
  const onChangeHasProResponse = (b: boolean | null) => {
    if (b) _reports.updateFilters(prev => ({...prev, status: Report.respondedStatus}))
    else if (b === false) _reports.updateFilters(prev => ({...prev, status: Report.notRespondedStatus}))
    else _reports.updateFilters(prev => ({...prev, status: undefined}))
  }

  function invertIfDefined(bool: boolean | null) {
    return bool === null ? null : !bool
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
  const onEmailChange = useCallback((email: string) => {
    _reports.updateFilters(prev => ({...prev, email}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onWebsiteURLChange = useCallback((websiteURL: string) => {
    _reports.updateFilters(prev => ({...prev, websiteURL}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onPhoneChange = useCallback((phone: string) => {
    _reports.updateFilters(prev => ({...prev, phone}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={1} sx={{mt: 0}}>
      <Grid item xs={12} md={6}>
        <SelectActivityCode
          label={m.codeNaf}
          value={_reports.filters.activityCodes ?? []}
          fullWidth
          onChange={(e, value) =>
            _reports.updateFilters(prev => ({
              ...prev,
              activityCodes: value,
            }))
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ScSelect
          small
          label={m.categories}
          fullWidth
          value={_reports.filters.category ?? ''}
          onChange={e => _reports.updateFilters(prev => ({...prev, category: e.target.value}))}
        >
          <MenuItem value="">&nbsp;</MenuItem>
          {_category?.data?.map(category => (
            <MenuItem key={category} value={category}>
              {m.ReportCategoryDesc[category]}
            </MenuItem>
          ))}
        </ScSelect>
      </Grid>
      <Grid item xs={12} md={6}>
        <ScMultiSelect
          label={m.status}
          value={_reports.filters.status ?? []}
          onChange={onChangeStatus}
          fullWidth
          withSelectAll
          renderValue={status => `(${status.length}) ${status.map(_ => m.reportStatusShort[_]).join(',')}`}
        >
          {Enum.values(ReportStatus).map(status => (
            <ScMenuItem withCheckbox key={status} value={status}>
              <ReportStatusLabel inSelectOptions dense fullWidth status={status} />
            </ScMenuItem>
          ))}
        </ScMultiSelect>
      </Grid>
      {connectedUser.isDGCCRF && (
        <Grid item xs={12} md={6}>
          <DebouncedInput value={_reports.filters.email ?? ''} onChange={onEmailChange}>
            {(value, onChange) => (
              <ScInput label={m.emailConsumer} fullWidth value={value} onChange={e => onChange(e.target.value)} />
            )}
          </DebouncedInput>
        </Grid>
      )}
      <Grid item xs={12} md={6}>
        <Box>
          <Box sx={css.trueFalseNullBox}>
            <Box sx={css.trueFalseNullLabel}>{m.website}</Box>
            <TrueFalseNull
              label={{
                true: <TrueLabel />,
              }}
              sx={{flexBasis: '50%'}}
              value={_reports.filters.hasWebsite ?? null}
              onChange={hasWebsite =>
                _reports.updateFilters(prev => ({
                  ...prev,
                  hasWebsite: hasWebsite ?? undefined,
                }))
              }
            />
          </Box>
          {_reports.filters.hasWebsite === true && (
            <DebouncedInput value={_reports.filters.websiteURL ?? ''} onChange={onWebsiteURLChange}>
              {(value, onChange) => <ScInput label={m.url} fullWidth value={value} onChange={e => onChange(e.target.value)} />}
            </DebouncedInput>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <Box sx={css.trueFalseNullBox}>
            <Box sx={css.trueFalseNullLabel}>{m.phone}</Box>
            <TrueFalseNull
              label={{
                true: <TrueLabel />,
              }}
              sx={{flexBasis: '50%'}}
              value={_reports.filters.hasPhone ?? null}
              onChange={hasPhone =>
                _reports.updateFilters(prev => ({
                  ...prev,
                  hasPhone: hasPhone ?? undefined,
                }))
              }
            />
          </Box>
          {_reports.filters.hasPhone === true && (
            <DebouncedInput value={_reports.filters.phone ?? ''} onChange={onPhoneChange}>
              {(value, onChange) => <ScInput label={m.phone} fullWidth value={value} onChange={e => onChange(e.target.value)} />}
            </DebouncedInput>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <Box sx={css.trueFalseNullBox}>
            <Box sx={css.trueFalseNullLabel}>{m.foreignCountry}</Box>
            <TrueFalseNull
              label={{
                true: <TrueLabel />,
              }}
              sx={{flexBasis: '50%'}}
              value={_reports.filters.hasForeignCountry ?? null}
              onChange={hasForeignCountry =>
                _reports.updateFilters(prev => ({
                  ...prev,
                  hasForeignCountry: hasForeignCountry ?? undefined,
                }))
              }
            />
          </Box>
          {_reports.filters.hasForeignCountry === true && (
            <SelectCountries
              label={m.foreignCountry}
              fullWidth
              value={_reports.filters.companyCountries}
              onChange={companyCountries =>
                _reports.updateFilters(prev => ({
                  ...prev,
                  companyCountries,
                }))
              }
            />
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={css.trueFalseNullBox}>
          <Box sx={css.trueFalseNullLabel}>{m.consoAnonyme}</Box>
          <TrueFalseNull
            value={invertIfDefined(_reports.filters.contactAgreement ?? null)}
            onChange={contactAgreement =>
              _reports.updateFilters(prev => ({
                ...prev,
                contactAgreement: invertIfDefined(contactAgreement) ?? undefined,
              }))
            }
            sx={{flexBasis: '50%'}}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={css.trueFalseNullBox}>
          <Box sx={css.trueFalseNullLabel}>{m.hasAttachement}</Box>
          <TrueFalseNull
            value={_reports.filters.hasAttachment ?? null}
            onChange={hasAttachment =>
              _reports.updateFilters(prev => ({
                ...prev,
                hasAttachment: hasAttachment ?? undefined,
              }))
            }
            sx={{flexBasis: '50%'}}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <Box sx={css.trueFalseNullBox}>
            <Box sx={css.trueFalseNullLabel}>{m.consumerReviews}</Box>
            <TrueFalseNull
              label={{
                true: <TrueLabel />,
              }}
              sx={{flexBasis: '50%'}}
              value={_reports.filters.hasEvaluation ?? null}
              onChange={hasEvaluation =>
                _reports.updateFilters(prev => ({
                  ...prev,
                  hasEvaluation: hasEvaluation ?? undefined,
                }))
              }
            />
          </Box>
          {_reports.filters.hasEvaluation === true && (
            <ScMultiSelect
              label={m.consumerReviews}
              value={_reports.filters.evaluation ?? []}
              onChange={evaluation => _reports.updateFilters(prev => ({...prev, evaluation}))}
              fullWidth
              withSelectAll
              renderValue={evaluation => `(${evaluation.length}) ${evaluation.map(_ => m.responseEvaluationShort[_]).join(',')}`}
            >
              {Enum.values(ResponseEvaluation).map(evaluation => (
                <ScMenuItem withCheckbox key={evaluation} value={evaluation}>
                  <ConsumerReviewLabel evaluation={evaluation} displayLabel />
                </ScMenuItem>
              ))}
            </ScMultiSelect>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <Box sx={css.trueFalseNullBox}>
            <Box sx={css.trueFalseNullLabel}>{m.proResponse}</Box>
            <TrueFalseNull
              label={{
                true: <TrueLabel />,
              }}
              sx={{flexBasis: '50%'}}
              value={hasProResponse}
              onChange={onChangeHasProResponse}
            />
          </Box>
          {hasProResponse === true && (
            <ScMultiSelect
              label={m.proResponse}
              value={proResponseFilter}
              onChange={onChangeProResponseFilter}
              fullWidth
              withSelectAll
              renderValue={proResponse => `(${proResponse.length}) ${proResponse.map(_ => m.reportResponseShort[_]).join(',')}`}
            >
              {Enum.values(ReportResponseTypes).map(proResponse => (
                <ScMenuItem withCheckbox key={proResponse} value={proResponse}>
                  <ProResponseLabel proResponse={proResponse} />
                </ScMenuItem>
              ))}
            </ScMultiSelect>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <Box sx={css.trueFalseNullBox}>
            <Box sx={css.trueFalseNullLabel}>{m.foreignReport}</Box>
            <TrueFalseNull
              sx={{flexBasis: '50%'}}
              value={_reports.filters.isForeign ?? null}
              onChange={isForeign =>
                _reports.updateFilters(prev => ({
                  ...prev,
                  isForeign: isForeign ?? undefined,
                }))
              }
            />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <Box sx={css.trueFalseNullBox}>
            <Box sx={css.trueFalseNullLabel}>Code-barres</Box>
            <TrueFalseNull
              sx={{flexBasis: '50%'}}
              value={_reports.filters.hasBarcode ?? null}
              onChange={hasBarcode =>
                _reports.updateFilters(prev => ({
                  ...prev,
                  hasBarcode: hasBarcode ?? undefined,
                }))
              }
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default AdvancedReportsFilter
