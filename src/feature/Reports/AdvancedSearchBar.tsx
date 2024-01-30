import {useI18n} from '../../core/i18n'
import {Page, PageTitle} from '../../shared/Page'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {Badge, Box, Checkbox, Chip, Collapse, Grid, Icon, MenuItem, Tooltip} from '@mui/material'
import {styled} from '@mui/material/styles'
import {ScOption} from 'core/helper/ScOption'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {NavLink} from 'react-router-dom'
import {Btn, Fender, IconBtn, Txt} from '../../alexlibs/mui-extension'
import {useSetState} from '../../alexlibs/react-hooks-lib'
import {Enum} from '../../alexlibs/ts-utils'
import {config} from '../../conf/config'
import {EntityIcon} from '../../core/EntityIcon'
import {Report, ReportingDateLabel, ReportStatus, ReportTag} from '../../core/client/report/Report'
import {useLogin} from '../../core/context/LoginContext'
import {cleanObject, getHostFromUrl, textOverflowMiddleCropping} from '../../core/helper'
import compose from '../../core/helper/compose'
import {
  mapArrayFromQuerystring,
  mapBooleanFromQueryString,
  mapDateFromQueryString,
  mapDatesToQueryString,
  useQueryString,
} from '../../core/helper/useQueryString'
import {Id, ReportResponse, ReportResponseTypes, ReportSearch, ResponseEvaluation} from '../../core/model'
import {siteMap} from '../../core/siteMap'
import {styleUtils, sxUtils} from '../../core/theme'
import {ScButton} from '../../shared/Button'
import {ConsumerReviewLabel} from '../../shared/ConsumerReviewLabel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {DatatableToolbar} from '../../shared/Datatable/DatatableToolbar'
import {DebouncedInput} from '../../shared/DebouncedInput'
import {ExportReportsPopper} from '../../shared/ExportPopperBtn'
import {ScInput} from '../../shared/ScInput'
import {ScMenuItem} from '../../shared/ScMenuItem'
import {Panel} from '../../shared/Panel'
import {PeriodPicker} from '../../shared/PeriodPicker'
import {ProResponseLabel} from '../../shared/ProResponseLabel'
import {ReportDetailValues} from '../../shared/ReportDetailValues'
import {ReportStatusLabel} from '../../shared/ReportStatus'
import {ScMultiSelect} from '../../shared/Select/MultiSelect'
import {ScSelect} from '../../shared/Select/Select'
import {SelectActivityCode} from '../../shared/SelectActivityCode'
import {SelectCountries} from '../../shared/SelectCountries/SelectCountries'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'
import {SelectTags} from '../../shared/SelectTags/SelectTags'
import {SelectTagsMenuValues} from '../../shared/SelectTags/SelectTagsMenu'
import {TrueFalseNull} from '../../shared/TrueFalseNull'
import {PanelBody} from 'alexlibs/mui-extension/Panel/PanelBody'
import {useMutation} from '@tanstack/react-query'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import {useCategoriesQuery} from '../../core/queryhooks/constantQueryHooks'
import SearchFilters from './ReportsFilter'
import AdvancedReportsFilter from './AdvancedReportsFilter'

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

const ExpandMore = styled((props: {expand: boolean}) => {
  const {expand, ...other} = props
  return <ExpandMoreIcon {...other} />
})(({theme, expand}) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

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

const AdvancedSearchBar = () => {
  const {m, formatDate} = useI18n()
  const {connectedUser, apiSdk} = useLogin()

  const downloadReports = useMutation({mutationFn: apiSdk.secured.reports.download})

  const selectReport = useSetState<Id>()
  const [expanded, setExpanded] = React.useState(false)
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

  const getReportingDate = (report: Report) =>
    report.details.filter(_ => _.label.indexOf(ReportingDateLabel) !== -1).map(_ => _.value)

  const filtersCount = useMemo(() => {
    const {offset, limit, ...filters} = _reports.filters
    return Object.keys(cleanObject(filters)).length
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
  const onWebsiteURLChange = useCallback((websiteURL: string) => {
    _reports.updateFilters(prev => ({...prev, websiteURL}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onPhoneChange = useCallback((phone: string) => {
    _reports.updateFilters(prev => ({...prev, phone}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Box
      sx={{
        flexWrap: 'wrap',
        whiteSpace: 'nowrap',
        mt: 2,
        mr: 3,
        ml: 3,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <ScButton onClick={_ => setExpanded(prev => !prev)}>
        <span style={{display: 'flex', alignItems: 'center'}}>
          <span>Recherche avancée&nbsp;</span>
          <ExpandMore expand={expanded} />
        </span>
      </ScButton>
      <Box
        sx={{
          flexWrap: 'wrap',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          '& > *': {
            mb: 1,
            ml: 1,
          },
        }}
      >
        {filtersCount !== 0 && (
          <Badge color="error" badgeContent={filtersCount} hidden={filtersCount === 0}>
            <ScButton icon="clear" onClick={_reports.clearFilters} variant="outlined" color="primary">
              {m.removeAllFilters}
            </ScButton>
          </Badge>
        )}
        <ExportReportsPopper
          disabled={ScOption.from(_reports?.result.data?.totalCount)
            .map(_ => _ > config.reportsLimitForExport)
            .getOrElse(false)}
          tooltipBtnNew={ScOption.from(_reports?.result.data?.totalCount)
            .map(_ => (_ > config.reportsLimitForExport ? m.cannotExportMoreReports(config.reportsLimitForExport) : ''))
            .getOrElse('')}
          filters={_reports.filters}
        >
          <Btn variant="outlined" color="primary" icon="get_app">
            {m.exportInXLS}
          </Btn>
        </ExportReportsPopper>
      </Box>
    </Box>
  )
}

export default AdvancedSearchBar
