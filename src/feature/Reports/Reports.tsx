import { useI18n } from '../../core/i18n'
import { Page, PageTitle } from '../../shared/Page'

import { Collapse, Grow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useApiContext } from 'core/context/ApiContext'
import { I18nContextShape } from 'core/context/i18n/i18nContext'
import { UseQueryPaginateResult } from 'core/queryhooks/UseQueryPaginate'
import { BookmarksCountQueryKey } from 'feature/Report/bookmarks/bookmarkUtils'
import {
  BookmarkButton,
  BookmarksIcon,
} from 'feature/Report/bookmarks/bookmarks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'
import { ConsumerReviewLabels } from 'shared/reviews/ConsumerReviewLabels'
import { UseSetState, useSetState } from '../../alexlibs/react-hooks-lib'
import {
  Report,
  ReportingDateLabel,
  ReportSearchResult,
  ReportStatus,
  ReportUtils,
} from '../../core/client/report/Report'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { cleanObject } from '../../core/helper'
import {
  Id,
  Paginate,
  PaginatedFilters,
  ReportResponseTypes,
  ReportSearch,
} from '../../core/model'
import { useCategoriesByStatusQuery } from '../../core/queryhooks/constantQueryHooks'
import { useReportSearchQuery } from '../../core/queryhooks/reportQueryHooks'
import { styleUtils, sxUtils } from '../../core/theme'
import {
  Datatable,
  DatatableColumnProps,
} from '../../shared/Datatable/Datatable'
import { ReportDetailValues } from '../../shared/ReportDetailValues'
import { ReportStatusLabel } from '../../shared/ReportStatus'
import { SelectTagsMenuValues } from '../../shared/SelectTags/SelectTagsMenu'
import { AdvancedReportsFilter } from './AdvancedReportsFilter'
import { AdvancedSearchBar } from './AdvancedSearchBar'
import { DatatableToolbarComponent } from './DatatableToolbarComponent'
import { ReportResponseDetails } from './ReportResponseDetails'
import { ReportsFilter } from './ReportsFilter'
import {
  ActionsColumn,
  CategoryColumn,
  CheckboxColumn,
  CheckboxColumnHead,
  CompanyNameColumn,
  EmailColumn,
  EmptyState,
  FilesColumn,
  PostalCodeColumn,
  SiretColumn,
  TagsColumn,
} from './reportsColumns'

export const Reports = ({
  search,
}: {
  search: ReportSearch & Partial<PaginatedFilters>
}) => {
  const i18n = useI18n()
  const { m } = i18n
  const { connectedUser } = useConnectedContext()
  const { api } = useApiContext()
  const navigate = useNavigate()

  const selectReport = useSetState<Id>()
  const [expanded, setExpanded] = useState(false)

  const _reports = useReportSearchQuery({
    offset: 0,
    limit: 25,
    ...search,
  })

  useEffect(() => {
    navigate({ to: '.', search: _reports.filters, replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_reports.filters])

  useEffect(() => {
    const { limit } = _reports.filters
    if (selectReport.size > limit) selectReport.clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_reports.filters])

  const filtersCount = useMemo(() => {
    const { offset, limit, ...filters } = _reports.filters
    return Object.keys(cleanObject(filters)).length
  }, [_reports.filters])

  const tags: SelectTagsMenuValues = {}
  _reports.filters.withTags?.forEach((tag) => {
    tags[tag] = 'included'
  })
  _reports.filters.withoutTags?.forEach((tag) => {
    tags[tag] = 'excluded'
  })

  const canReopen =
    _reports.result.data?.entities.find(
      (_) =>
        selectReport.has(_.report.id) &&
        !ReportUtils.canReopenReport(_.report.status),
    ) === undefined

  const _categoriesByStatus = useCategoriesByStatusQuery()
  const _categories = connectedUser.isAdmin
    ? [
        ...(_categoriesByStatus.data?.active ?? []),
        ...(_categoriesByStatus.data?.inactive ?? []),
        ...(_categoriesByStatus.data?.closed ?? []),
      ]
    : [
        ...(_categoriesByStatus.data?.active ?? []),
        ...(_categoriesByStatus.data?.inactive ?? []),
      ]

  const [proResponseFilter, setProResponseFilter] = useState<
    ReportResponseTypes[]
  >([])

  const proResponseToStatus = {
    [ReportResponseTypes.Accepted]: ReportStatus.PromesseAction,
    [ReportResponseTypes.NotConcerned]: ReportStatus.MalAttribue,
    [ReportResponseTypes.Rejected]: ReportStatus.Infonde,
  }

  const onChangeStatus = (status: ReportStatus[]) => {
    const responses = status.flatMap((reportStatus) => {
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
    _reports.updateFilters((prev) => ({ ...prev, status }))
  }

  const onChangeProResponseFilter = (responses: ReportResponseTypes[]) => {
    setProResponseFilter(responses)
    const status =
      responses.length === 0
        ? ReportUtils.respondedStatus
        : responses.map((_) => proResponseToStatus[_])
    _reports.updateFilters((prev) => ({ ...prev, status }))
  }

  const hasProResponse =
    _reports.filters.status?.length === 0
      ? null
      : _reports.filters.status?.every((status) =>
            ReportUtils.respondedStatus.includes(status),
          )
        ? true
        : _reports.filters.status?.every((status) =>
              ReportUtils.notRespondedStatus.includes(status),
            )
          ? false
          : null
  const onChangeHasProResponse = (b: boolean | null) => {
    if (b)
      _reports.updateFilters((prev) => ({
        ...prev,
        status: ReportUtils.respondedStatus,
      }))
    else if (b === false)
      _reports.updateFilters((prev) => ({
        ...prev,
        status: ReportUtils.notRespondedStatus,
      }))
    else _reports.updateFilters((prev) => ({ ...prev, status: undefined }))
  }

  // TRELLO-1728 The object _reports change all the time.
  // If we put it in dependencies, it causes problems with the debounce,
  // and the search input "stutters" when typing fast
  const onDetailsChange = useCallback((details: string) => {
    _reports.updateFilters((prev) => ({ ...prev, details }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onSiretSirenChange = useCallback((siretSirenList: string[]) => {
    _reports.updateFilters((prev) => ({ ...prev, siretSirenList }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onEmailChange = useCallback((email: string) => {
    _reports.updateFilters((prev) => ({ ...prev, email }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onConsumerPhoneChange = useCallback((consumerPhone: string) => {
    _reports.updateFilters((prev) => ({ ...prev, consumerPhone }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onWebsiteURLChange = useCallback((websiteURL: string) => {
    _reports.updateFilters((prev) => ({ ...prev, websiteURL }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onPhoneChange = useCallback((phone: string) => {
    _reports.updateFilters((prev) => ({ ...prev, phone }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onSubcategoriesChange = useCallback((subcategories: string) => {
    const test = subcategories.split(',')
    _reports.updateFilters((prev) => ({ ...prev, subcategories: test }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const _bookmarksCount = useQuery({
    queryKey: BookmarksCountQueryKey,
    queryFn: api.secured.reports.countBookmarks,
  })
  const isAdmin = connectedUser.isAdmin
  const columns = buildColumns({
    _reports,
    selectReport,
    i18n,
    isAdmin,
  })
  return (
    <Page>
      <div className="flex gap-2 justify-between items-baseline">
        <PageTitle>{m.reports_pageTitle}</PageTitle>

        {_bookmarksCount.data !== undefined && _bookmarksCount.data > 0 && (
          <Grow in>
            <span>
              <BookmarksIcon /> Marque-pages :{' '}
              <button
                className="font-bold text-scbluefrance underline"
                onClick={() => {
                  _reports.updateFilters((prev) => {
                    return {
                      // ...prev,
                      isBookmarked: true,
                      offset: prev.offset,
                      limit: prev.limit,
                    }
                  })
                }}
              >
                {_bookmarksCount.data} signalement
                {_bookmarksCount.data > 1 ? 's' : ''}{' '}
              </button>
            </span>
          </Grow>
        )}
      </div>
      <CleanDiscreetPanel noShadow>
        <>
          <ReportsFilter
            _reports={_reports}
            onDetailsChange={onDetailsChange}
            onSiretSirenChange={onSiretSirenChange}
            onEmailChange={onEmailChange}
            connectedUser={connectedUser}
            tags={tags}
          />
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <AdvancedReportsFilter
              _reports={_reports}
              onChangeStatus={onChangeStatus}
              onEmailChange={onEmailChange}
              onConsumerPhoneChange={onConsumerPhoneChange}
              onWebsiteURLChange={onWebsiteURLChange}
              onPhoneChange={onPhoneChange}
              onChangeHasProResponse={onChangeHasProResponse}
              _categories={_categories}
              connectedUser={connectedUser}
              hasProResponse={hasProResponse}
              proResponseFilter={proResponseFilter}
              setProResponseFilter={setProResponseFilter}
              onChangeProResponseFilter={onChangeProResponseFilter}
              proResponseToStatus={proResponseToStatus}
              onSubcategoriesChange={onSubcategoriesChange}
            />
          </Collapse>
        </>
        <AdvancedSearchBar
          expanded={expanded}
          _reports={_reports}
          setExpanded={setExpanded}
          filtersCount={filtersCount}
          selectReport={selectReport}
        />
      </CleanDiscreetPanel>
      <Datatable
        id="reports"
        headerMain={
          <DatatableToolbarComponent
            {...{
              selectReport,
              canReOpen: canReopen,
              reportFilter: _reports.filters,
            }}
          />
        }
        loading={_reports.result.isFetching}
        paginate={{
          offset: _reports.filters.offset,
          limit: _reports.filters.limit,
          onPaginationChange: (pagination) =>
            _reports.updateFilters((prev) => ({ ...prev, ...pagination })),
        }}
        getRenderRowKey={(_) => _.report.id}
        data={_reports.result.data?.entities}
        total={_reports.result.data?.totalCount}
        configurableColumns={true}
        initialHiddenColumns={
          connectedUser.isDGCCRF
            ? [
                'companyPostalCode',
                'companySiret',
                'companyCountry',
                'phone',
                'reportDate',
                'status',
                'file',
              ]
            : []
        }
        columns={columns}
        renderEmptyState={<EmptyState onClearFilters={_reports.clearFilters} />}
      />
    </Page>
  )
}

function buildColumns({
  _reports,
  selectReport,
  i18n,
  isAdmin,
}: {
  _reports: UseQueryPaginateResult<
    ReportSearch & PaginatedFilters,
    Paginate<ReportSearchResult>,
    unknown
  >
  selectReport: UseSetState<string>
  i18n: I18nContextShape
  isAdmin: boolean
}): DatatableColumnProps<ReportSearchResult>[] {
  const { m, formatDate } = i18n

  const checkboxColumn = {
    alwaysVisible: true,
    id: 'checkbox',
    head: (() => <CheckboxColumnHead {...{ _reports, selectReport }} />)(),
    style: { width: 0 },
    render: (r: ReportSearchResult) => (
      <CheckboxColumn {...{ r, selectReport }} />
    ),
  }

  return [
    ...(isAdmin ? [checkboxColumn] : []),
    {
      id: 'bookmark',
      head: <>Marque-pages</>,
      render: (r) => {
        return (
          <BookmarkButton
            isBookmarked={r.isBookmarked}
            reportId={r.report.id}
          />
        )
      },
    },
    {
      id: 'companyPostalCode',
      head: m.postalCodeShort,
      sx: (_) => ({
        maxWidth: 76,
      }),
      render: (r) => <PostalCodeColumn {...{ r }} />,
    },
    {
      id: 'companyName',
      head: m.company,
      sx: (_) => ({
        lineHeight: 1.4,
        maxWidth: 170,
      }),
      render: (r) => <CompanyNameColumn {...{ r }} />,
    },
    {
      id: 'companySiret',
      head: m.siret,
      render: (r) => <SiretColumn {...{ r }} />,
    },
    {
      id: 'companyCountry',
      head: m.country,
      render: (_) => _.report.companyAddress.country?.name,
    },
    {
      id: 'phone',
      head: 'Téléphone appelant',
      render: (r) => <div>{r.report.phone}</div>,
    },
    {
      id: 'category',
      head: m.problem,
      sx: (_) => ({
        maxWidth: 200,
      }),
      render: (r) => <CategoryColumn {...{ r }} />,
    },
    {
      id: 'creationDate',
      head: m.creation,
      render: (_) => formatDate(_.report.creationDate),
    },
    {
      id: 'reportDate',
      head: 'Date constat',
      render: (_) => getReportingDate(_.report),
    },
    {
      id: 'details',
      head: m.details,
      sx: (_) => ({
        fontSize: (t) => styleUtils(t).fontSize.small,
        color: (t) => t.palette.text.secondary,
        maxWidth: 200,
        minWidth: 200,
        lineHeight: 1.4,
        whiteSpace: 'initial',
      }),
      render: (_) => <ReportDetailValues input={_.report.details} lines={2} />,
    },
    {
      id: 'tags',
      head: m.tags,
      render: (r) => <TagsColumn {...{ r }} />,
    },
    {
      id: 'status',
      head: m.status,
      render: (_) => <ReportStatusLabel dense status={_.report.status} />,
    },
    {
      id: 'email',
      head: m.consumer,
      sx: (_) => ({
        maxWidth: 160,
      }),
      render: (r) => <EmailColumn {...{ r }} />,
    },
    {
      id: 'proResponse',
      head: m.proResponse,
      render: (_) => (
        <ReportResponseDetails
          details={_.professionalResponse?.event.details}
        />
      ),
    },
    {
      id: 'avisConso',
      head: m.consumerReviews,
      render: (_) => <ConsumerReviewLabels detailsTooltip report={_} />,
    },
    {
      id: 'dateAvisConso',
      head: "Date de l'avis Conso",
      render: (_) => formatDate(_.consumerReview?.creationDate),
    },

    {
      id: 'file',
      head: m.files,
      sx: (_) => ({
        minWidth: 44,
        maxWidth: 100,
      }),
      render: (r) => <FilesColumn {...{ r }} />,
    },
    {
      id: 'actions',
      stickyEnd: true,
      sx: (_) => sxUtils.tdActions,
      render: (r) => <ActionsColumn {...{ r }} />,
    },
  ]
}

const getReportingDate = (report: Report) =>
  report.details
    .filter((_) => _.label.indexOf(ReportingDateLabel) !== -1)
    .map((_) => _.value)
