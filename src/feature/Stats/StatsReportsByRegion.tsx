import {useEffect, useMemo, useState} from 'react'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {Divider, Icon, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from '@mui/material'
import {useConstantContext} from '../../core/context/ConstantContext'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {classes} from '../../core/helper/utils'
import {Panel, PanelHead} from '../../shared/Panel'
import {ScButton} from '../../shared/Button/Button'
import {siteMap} from '../../core/siteMap'
import {NavLink} from 'react-router-dom'
import {useEffectFn} from '../../shared/hooks/UseEffectFn'
import {useToast} from '../../core/toast'
import {SelectMonth} from '../../shared/SelectMonth/SelectMonth'
import {useGetDateForMonthAndPreviousOne} from './useGetDateForMonthAndPreviousOne'
import {Alert} from 'mui-extension'
import * as React from 'react'

export const StatsReportsByRegion = () => {
  const {apiSdk: api} = useLogin()
  const {m, formatLargeNumber} = useI18n()
  const cssUtils = useCssUtils()
  const {toastError} = useToast()

  const _constant = useConstantContext()

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
    _constant.regions.fetch({force: false})
  }, [])

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
      <Alert type="info" className={cssUtils.marginBottom2}>
        <span dangerouslySetInnerHTML={{__html: m.reportsDistributionDesc}} className={cssUtils.tooltipColorTxtSecondary} />
      </Alert>
      <PanelHead className={cssUtils.marginBottom2} action={<SelectMonth value={selectedMonth} onChange={setSelectedMonth} />}>
        {m.reportsDistribution}
      </PanelHead>
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
                  <Icon className={cssUtils.colorTxtHint}>show_chart</Icon>
                </Tooltip>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          {_countByDepCurrentMonth.entity && positionByDep && _constant.regions.entity && _constant.departmentsIndex && (
            <TableBody>
              {_countByDepCurrentMonth.entity.slice(0, 20).map(([depNumber, count], i) => (
                <TableRow key={depNumber}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    {(() => {
                      return depNumber ? (
                        <span>
                          {_constant.departmentsIndex![depNumber]} <span className={cssUtils.colorTxtHint}>({depNumber})</span>
                        </span>
                      ) : (
                        <span> N/A </span>
                      )
                    })()}
                  </TableCell>
                  <TableCell>{formatLargeNumber(count)}</TableCell>
                  <TableCell>
                    {(() => {
                      const oldPosition = positionByDep[depNumber]
                      if (oldPosition === i) {
                        return <span className={classes(cssUtils.txtBold, cssUtils.colorTxtHint)}>=</span>
                      } else if (oldPosition > i) {
                        return <span className={classes(cssUtils.txtBold, cssUtils.colorError)}>+{oldPosition - i}</span>
                      } else {
                        return <span className={classes(cssUtils.txtBold, cssUtils.colorSuccess)}>{oldPosition - i}</span>
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
