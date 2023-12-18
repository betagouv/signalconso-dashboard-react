import * as React from 'react'
import {useEffect, useMemo, useState} from 'react'
import {useEffectFn, useFetcher} from '../../alexlibs/react-hooks-lib'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {Box, BoxProps, Divider, Icon, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScButton} from '../../shared/Button'
import {siteMap} from '../../core/siteMap'
import {NavLink} from 'react-router-dom'
import {useToast} from '../../core/toast'
import {SelectMonth} from '../../shared/SelectMonth'
import {useGetDateForMonthAndPreviousOne} from './useGetDateForMonthAndPreviousOne'
import {Txt} from '../../alexlibs/mui-extension'
import {useRegionsQuery} from '../../core/queryhooks/constantQueryHooks'

const CellNewPosition = ({sx, ...props}: BoxProps) => {
  return <Box {...props} component="span" sx={{fontWeight: t => t.typography.fontWeightBold, ...sx}} />
}

export const StatsReportsByRegion = () => {
  const {apiSdk: api} = useLogin()
  const {m, formatLargeNumber} = useI18n()
  const {toastError} = useToast()

  const _regions = useRegionsQuery()
  const departmentsIndex: {[key: string]: string} | undefined = useMemo(
    () => _regions.data?.flatMap(_ => _.departments).reduce((acc, dep) => ({...acc, [dep.code]: dep.label}), {}),
    [_regions.data],
  )

  const currentMonth = useMemo(() => new Date().getMonth(), [])
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)

  const _countByDepCurrentMonth = useFetcher(api.secured.reports.getCountByDepartments)
  const _countByDepLastMonth = useFetcher(api.secured.reports.getCountByDepartments)

  const dates = useGetDateForMonthAndPreviousOne(selectedMonth)

  const fetch = () => {
    _countByDepCurrentMonth.fetch({clean: false}, {...dates.current})
    _countByDepLastMonth.fetch({clean: false}, {...dates.lastMonth})
  }

  useEffect(() => {
    fetch()
  }, [selectedMonth])

  const positionByDep: {[key: string]: number} | undefined = useMemo(() => {
    if (_countByDepLastMonth.entity) {
      return _countByDepLastMonth.entity.reduce((acc, current, i) => ({...acc, [current[0]]: i}), {})
    }
  }, [_countByDepLastMonth.entity])

  useEffectFn(_countByDepCurrentMonth.error, toastError)
  useEffectFn(_countByDepLastMonth.error, toastError)

  return (
    <Panel loading={_countByDepCurrentMonth.loading || _countByDepLastMonth.loading}>
      <PanelHead sx={{mb: 2}} action={<SelectMonth value={selectedMonth} onChange={setSelectedMonth} />}>
        {m.reportsDistribution}
      </PanelHead>
      <PanelBody>
        <Txt color="hint" gutterBottom block dangerouslySetInnerHTML={{__html: m.reportsDistributionDesc}} />
      </PanelBody>
      <Divider />
      <div style={{overflowX: 'auto', position: 'relative'}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>{m.department}</TableCell>
              <TableCell>{m.reports}</TableCell>
              <TableCell>
                <Tooltip title={m.positionComparedToLastMonth}>
                  <Icon sx={{color: t => t.palette.text.disabled}}>show_chart</Icon>
                </Tooltip>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          {_countByDepCurrentMonth.entity && positionByDep && _regions.data && departmentsIndex && (
            <TableBody>
              {_countByDepCurrentMonth.entity.slice(0, 20).map(([depNumber, count], i) => (
                <TableRow key={depNumber}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    {depNumber ? (
                      <span>
                        {departmentsIndex![depNumber]}{' '}
                        <Box component="span" sx={{color: t => t.palette.text.disabled}}>
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
                      const oldPosition = positionByDep[depNumber]
                      if (oldPosition === i) {
                        return <CellNewPosition sx={{color: t => t.palette.text.disabled}}>=</CellNewPosition>
                      } else if (oldPosition > i) {
                        return <CellNewPosition sx={{color: t => t.palette.error.main}}>+{oldPosition - i}</CellNewPosition>
                      } else {
                        return <CellNewPosition sx={{color: t => t.palette.success.light}}>{oldPosition - i}</CellNewPosition>
                      }
                    })()}
                  </TableCell>
                  <TableCell style={{textAlign: 'right'}}>
                    <NavLink
                      to={siteMap.logged.reports({
                        departments: [depNumber],
                        start: dates.current.start,
                        end: dates.current.end,
                      })}
                    >
                      <ScButton color="primary" size="small">
                        {m.see}
                      </ScButton>
                    </NavLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </Panel>
  )
}
