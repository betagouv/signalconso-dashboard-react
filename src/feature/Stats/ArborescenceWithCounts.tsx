import { Badge, Box, Icon, useTheme } from '@mui/material'
import { useMutation, UseQueryResult } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ApiError } from 'core/client/ApiClient'
import { QuickSmallReportSearchLink } from 'feature/Report/quickSmallLinks'
import { parseInt } from 'lodash'
import { useEffect, useState } from 'react'
import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { IconBtn } from '../../alexlibs/mui-extension'
import { ReportNode, ReportNodes } from '../../core/client/report/ReportNode'
import { ReportNodeSearch } from '../../core/client/report/ReportNodeSearch'
import { useApiContext } from '../../core/context/ApiContext'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useI18n } from '../../core/i18n'
import {
  AnalyticActionName,
  EventCategories,
  StatisticsActions,
  trackEvent,
} from '../../core/plugins/Matomo'
import { useGetCountBySubCategoriesQuery } from '../../core/queryhooks/reportQueryHooks'
import { ScButton } from '../../shared/Button'
import { DebouncedInput } from '../../shared/DebouncedInput'
import { PeriodPicker } from '../../shared/PeriodPicker'
import { SelectDepartments } from '../../shared/SelectDepartments/SelectDepartments'

const compare = (a?: string[], b?: string[]): number => {
  if (!a || !b) return 0
  else if (a.length === 0 || b.length === 0) return 0
  else if (a[0] === b[0]) return compare(a.slice(1), b.slice(1))
  else return parseInt(a[0]) - parseInt(b[0])
}
const sortById = (reportNode1: ReportNode, reportNode2: ReportNode) =>
  compare(reportNode1.id?.split('.'), reportNode2.id?.split('.'))

export const ArborescenceWithCounts = ({
  search,
}: {
  search: ReportNodeSearch
}) => {
  const { m } = useI18n()
  const { connectedUser } = useConnectedContext()
  const navigate = useNavigate()

  const begin = new Date()
  begin.setDate(begin.getDate() - 90)
  begin.setHours(0, 0, 0, 0)

  const [start, setStart] = useState<Date | undefined>(search.start ?? begin)
  const [end, setEnd] = useState<Date | undefined>(search.end)
  const [departments, setDepartments] = useState<string[] | undefined>(
    search.departments,
  )

  const countBySubCategories = useGetCountBySubCategoriesQuery({
    start,
    end,
    departments,
  })

  useEffect(() => {
    navigate({ to: '.', search: { start, end, departments }, replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, departments])

  const { api } = useApiContext()
  const _download = useMutation({
    mutationFn: (lang: string) =>
      api.secured.reports.downloadCountBySubCategories({
        lang,
        start,
        end,
        departments,
      }),
  })

  useEffect(() => {
    if (countBySubCategories.data) {
      trackEvent(
        connectedUser,
        EventCategories.Statistiques,
        StatisticsActions.reportCountsBySubcategories,
        AnalyticActionName.success,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countBySubCategories.data])

  const resetFilters = () => {
    setStart(undefined)
    setEnd(undefined)
    setDepartments(undefined)
  }

  const badgeCount = [start, end, departments].reduce(
    (acc, filter) => acc + (filter ? 1 : 0),
    0,
  )

  return (
    <>
      <CleanWidePanel>
        <h2 className="font-bold text-lg mb-2">{m.dateFilters}</h2>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div>
              <DebouncedInput<[Date | undefined, Date | undefined]>
                value={[start, end]}
                onChange={([start, end]) => {
                  setStart(start)
                  setEnd(end)
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
            </div>
            <div>
              <SelectDepartments
                label={m.departments}
                value={departments}
                onChange={(departments) => setDepartments(departments)}
                sx={{ mr: 1 }}
                fullWidth
              />
            </div>
          </div>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              '& > *': {
                mb: 1,
                ml: 1,
              },
            }}
          >
            <ScButton
              icon="download"
              onClick={() => _download.mutate('fr')}
              variant="outlined"
              color="primary"
              sx={{ mb: 1, ml: 1 }}
            >
              {m.download} (FR)
            </ScButton>
            <ScButton
              icon="download"
              onClick={() => _download.mutate('en')}
              variant="outlined"
              color="primary"
              sx={{ mb: 1, ml: 1 }}
            >
              {m.download} (EN)
            </ScButton>
            <Badge
              color="error"
              badgeContent={badgeCount}
              hidden={badgeCount === 0}
            >
              <ScButton
                icon="clear"
                onClick={resetFilters}
                variant="outlined"
                color="primary"
              >
                {m.removeAllFilters}
              </ScButton>
            </Badge>
          </Box>
        </div>
      </CleanWidePanel>
      <LangPanel
        {...{ countBySubCategories }}
        lang="fr"
        start={start}
        end={end}
      />
      <LangPanel
        {...{ countBySubCategories }}
        lang="en"
        start={start}
        end={end}
      />
    </>
  )
}

function LangPanel({
  countBySubCategories,
  lang: langKey,
  start,
  end,
}: {
  countBySubCategories: UseQueryResult<ReportNodes, ApiError>
  lang: 'fr' | 'en'
  start: Date | undefined
  end: Date | undefined
}) {
  const [openAll, setOpenAll] = useState(false)
  const { m } = useI18n()
  return (
    <CleanWidePanel loading={countBySubCategories.isLoading}>
      <div className="flex justify-between items-center">
        <h2 className="font-bold">
          {langKey === 'fr'
            ? m.statsCountBySubCategories
            : m.statsCountBySubCategoriesForeign}
        </h2>
        <ScButton
          onClick={() => setOpenAll(!openAll)}
          variant="contained"
          color="primary"
        >
          {m.expandAll}
        </ScButton>
      </div>

      <div className="space-y-2">
        {countBySubCategories.data?.[langKey]
          .sort(sortById)
          .map((reportNode) => (
            <Node
              open={openAll}
              reportNode={reportNode}
              path={[]}
              start={start}
              end={end}
              foreign={langKey !== 'fr'}
              key={reportNode.id}
            />
          ))}
      </div>
    </CleanWidePanel>
  )
}

const Node = ({
  reportNode: n,
  open,
  path,
  start,
  end,
  foreign,
}: {
  reportNode: ReportNode
  open?: boolean
  path: string[]
  start: Date | undefined
  end: Date | undefined
  foreign: boolean
}) => {
  const iconWidth = 40
  const iconMargin = 8
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    setIsOpen(!!open)
  }, [open])

  const fullPath = [...path, n.name]
  const url = '/suivi-des-signalements'
  const search = {
    category: fullPath[0],
    subcategories: fullPath.length > 0 ? fullPath.slice(1) : undefined,
    start,
    end,
    isForeign: foreign,
  }

  return (
    <div className="flex items-start">
      {n.children.length !== 0 ? (
        <IconBtn
          color="primary"
          onClick={() => setIsOpen((_) => !_)}
          className="!p-0  !mr-2"
        >
          <Icon style={{ fontSize: '1em' }}>
            {isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
          </Icon>
        </IconBtn>
      ) : (
        <IconBtn disabled>
          <Icon>forward</Icon>
        </IconBtn>
      )}
      <div className="w-full">
        <div className="flex flex-col justify-center min-h-[42px]">
          {n.id ? (
            <p className="max-w-[80%] truncate">
              <span className="font-bold">{n.label ?? n.name}</span>{' '}
              {n.overriddenCategory ? `(${n.overriddenCategory}) ` : undefined}
              <span className="text-sm text-gray-500">id : {n.id}</span>
            </p>
          ) : (
            <div className="max-w-[80%]">
              <p className="text-gray-500">
                {n.label ?? n.name}
                <br />
                (Ancienne catégorie)
              </p>
            </div>
          )}
          <p>
            {n.count} signalements{' '}
            <QuickSmallReportSearchLink reportSearch={search} label="voir" />
          </p>
          <p className="">dont {n.reclamations} réclamations (RéponseConso)</p>
          <div>
            {n.tags?.map((tag) => (
              <Box
                sx={{
                  mr: 1,
                  borderRadius: 100,
                  height: 26,
                  px: 1.5,
                  backgroundColor: (t) => t.palette.action.disabledBackground,
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: theme.typography.fontSize,
                  // fontWeight: t => t.typography.fontWeightBold,
                  color: (t) => t.palette.text.secondary,
                }}
                key={tag}
              >
                {tag}
              </Box>
            ))}
          </div>
        </div>
        {isOpen && n.children.length !== 0 && (
          <Box
            sx={{
              my: 1,
              position: 'relative',
              '&:before': {
                content: "' '",
                height: '100%',
                width: '1px',
                position: 'absolute',
                background: (t) => t.palette.divider,
                left: -iconWidth / 2 - iconMargin,
                // borderLeft: t => `1px solid ${t.palette.divider}`
              },
            }}
          >
            {n.children.sort(sortById).map((reportNode) => (
              <Node
                open={open}
                reportNode={reportNode}
                path={fullPath}
                start={start}
                end={end}
                foreign={foreign}
                key={reportNode.id}
              />
            ))}
          </Box>
        )}
      </div>
    </div>
  )
}
