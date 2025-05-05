import {
  Box,
  BoxProps,
  Divider,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { Txt } from '../../alexlibs/mui-extension'
import { useI18n } from '../../core/i18n'
import { useRegionsQuery } from '../../core/queryhooks/constantQueryHooks'
import { useGetCountByDepartmentsQuery } from '../../core/queryhooks/reportQueryHooks'
import { ScButton } from '../../shared/Button'
import { SelectMonth } from '../../shared/SelectMonth'
import { useGetDateForMonthAndPreviousOne } from './useGetDateForMonthAndPreviousOne'
import { Link } from '@tanstack/react-router'

const CellNewPosition = ({ sx, ...props }: BoxProps) => {
  return (
    <Box
      {...props}
      component="span"
      sx={{ fontWeight: (t) => t.typography.fontWeightBold, ...sx }}
    />
  )
}

export const StatsReportsByRegion = () => {
  const { m, formatLargeNumber } = useI18n()

  const _regions = useRegionsQuery()
  const departmentsIndex: { [key: string]: string } | undefined = useMemo(
    () =>
      _regions.data
        ?.flatMap((_) => _.departments)
        .reduce((acc, dep) => ({ ...acc, [dep.code]: dep.label }), {}),
    [_regions.data],
  )

  const currentMonth = useMemo(() => new Date().getMonth(), [])
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)

  const dates = useGetDateForMonthAndPreviousOne(selectedMonth)

  const _countByDepCurrentMonth = useGetCountByDepartmentsQuery({
    ...dates.current,
  })
  const _countByDepLastMonth = useGetCountByDepartmentsQuery({
    ...dates.lastMonth,
  })

  const positionByDepLastMonth: { [key: string]: number } | undefined =
    useMemo(() => {
      if (_countByDepLastMonth.data) {
        return _countByDepLastMonth.data.reduce(
          (acc, current, i) => ({ ...acc, [current[0]]: i }),
          {},
        )
      }
    }, [_countByDepLastMonth.data])

  return (
    <CleanWidePanel
      loading={
        _countByDepCurrentMonth.isLoading || _countByDepLastMonth.isLoading
      }
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold ">{m.reportsDistribution}</h2>
        <SelectMonth value={selectedMonth} onChange={setSelectedMonth} />
      </div>
      <div>
        <Txt
          color="hint"
          gutterBottom
          block
          dangerouslySetInnerHTML={{ __html: m.reportsDistributionDesc }}
        />
      </div>
      <Divider />
      <div style={{ overflowX: 'auto', position: 'relative' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>{m.department}</TableCell>
              <TableCell>{m.reports}</TableCell>
              <TableCell>
                <Tooltip title={m.positionComparedToLastMonth}>
                  <Icon sx={{ color: (t) => t.palette.text.disabled }}>
                    show_chart
                  </Icon>
                </Tooltip>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          {_countByDepCurrentMonth.data &&
            positionByDepLastMonth &&
            _regions.data &&
            departmentsIndex && (
              <TableBody>
                {_countByDepCurrentMonth.data
                  .slice(0, 20)
                  .map(([depNumber, count], i) => (
                    <TableRow key={depNumber}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        {depNumber ? (
                          <span>
                            {departmentsIndex![depNumber]}{' '}
                            <Box
                              component="span"
                              sx={{ color: (t) => t.palette.text.secondary }}
                            >
                              ({depNumber})
                            </Box>
                          </span>
                        ) : (
                          <span>N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{formatLargeNumber(count)}</TableCell>
                      <TableCell>
                        {(() => {
                          const currentPos = i
                          const oldPos: number | undefined =
                            positionByDepLastMonth[depNumber]
                          if (oldPos === undefined) {
                            return null
                          }
                          if (oldPos === currentPos) {
                            return (
                              <CellNewPosition
                                sx={{ color: (t) => t.palette.text.disabled }}
                              >
                                =
                              </CellNewPosition>
                            )
                          }
                          if (oldPos > currentPos) {
                            return (
                              <CellNewPosition
                                sx={{ color: (t) => t.palette.error.main }}
                              >
                                +{oldPos - currentPos}
                              </CellNewPosition>
                            )
                          }
                          return (
                            <CellNewPosition
                              sx={{ color: (t) => t.palette.success.light }}
                            >
                              {oldPos - currentPos}
                            </CellNewPosition>
                          )
                        })()}
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <Link
                          to="/suivi-des-signalements"
                          search={{
                            departments: [depNumber],
                            start: dates.current.start,
                            end: dates.current.end,
                          }}
                        >
                          <ScButton color="primary" size="small">
                            {m.see}
                          </ScButton>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            )}
        </Table>
      </div>
    </CleanWidePanel>
  )
}
