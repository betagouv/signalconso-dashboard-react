import {
  LinearProgress,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Theme,
} from '@material-ui/core'
import React, {CSSProperties, ReactNode, useEffect, useMemo} from 'react'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {classes} from '../../core/helper/utils'
import {DatatableColumnToggle} from './DatatableColumnsToggle'
import {useSetState} from '@alexandreannic/react-hooks-lib/lib'
import {useI18n} from '../../core/i18n'
import {Fender} from 'mui-extension/lib'

type OrderBy = 'asc' | 'desc'

export interface DatatableProps<T> {
  header?: ReactNode
  loading?: boolean
  total?: number
  data?: T[]
  getRenderRowKey?: (_: T) => string
  onClickRows?: (_: T, event: React.MouseEvent<HTMLTableRowElement>) => void
  rows: DatatableColumnProps<T>[]
  showColumnsToggle?: boolean
  showColumnsToggleBtnTooltip?: string
  renderEmptyState?: ReactNode
  rowsPerPageOptions?: number[]
  paginate?: {
    minRowsBeforeDisplay?: number
    offset: number
    limit: number
    onPaginationChange: (_: {offset?: number; limit?: number}) => void
  }
  sort?: {
    sortBy: string
    orderBy: OrderBy
    onSortChange: (_: {sortBy: string; orderBy: OrderBy}) => void
  }
}

export interface DatatableColumnProps<T> {
  id: string
  head?: string | ReactNode
  row: (_: T) => ReactNode
  hidden?: boolean
  alwaysVisible?: boolean
  className?: string | ((_: T) => string | undefined)
  style?: CSSProperties
  stickyEnd?: boolean
}

const useStyles = makeStyles((t: Theme) => ({
  container: {
    overflowX: 'auto',
    position: 'relative',
  },
  table: {
    minWidth: '100%',
    tableLayout: 'fixed',
    width: 'auto', // Override width: 100% from Material-UI that breaks sticky columns
  },
  stickyEnd: {
    paddingTop: 1,
    position: 'sticky',
    right: 0,
    background: t.palette.background.paper,
  },
  cellHeader: {
    color: t.palette.text.secondary,
  },
  btnColumnsToggle: {
    marginLeft: 'auto',
  },
  header: {
    display: 'flex',
    // flexWrap: 'wrap',
    alignItems: 'center',
    minHeight: 52,
    borderBottom: `1px solid ${t.palette.divider}`,
    paddingLeft: t.spacing(1),
    paddingRight: t.spacing(1),
  },
  paginate: {
    padding: t.spacing(0, 2),
    minHeight: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  fenderContainer: {
    padding: t.spacing(2, 2),
    textAlign: 'center',
  },
  hoverableRows: {
    '&:hover': {
      background: t.palette.action.hover,
    },
  },
  loadingTd: {
    height: 0,
    marginBottom: -1,
    padding: 0,
    border: 'none',
  },
  loading: {},
}))

const safeParseInt = (maybeInt: any, defaultValue: number): number => (isNaN(maybeInt) ? defaultValue : parseInt(maybeInt))

export const Datatable = <T extends any = any>(props: DatatableProps<T>) => {
  const {m} = useI18n()
  const {
    loading,
    total,
    data,
    rows,
    getRenderRowKey,
    header,
    showColumnsToggle,
    showColumnsToggleBtnTooltip = m.toggleDatatableColumns,
    renderEmptyState,
    rowsPerPageOptions = [5, 10, 25, 100],
    sort,
    onClickRows,
    paginate,
  } = props

  const css = useStyles()
  const cssUtils = useCssUtils()
  const displayableRows = useMemo(() => rows.filter(_ => !_.hidden), [rows])
  const toggleableColumnsName = useMemo(() => displayableRows.filter(_ => !_.alwaysVisible), [displayableRows])
  const displayedColumnsSet = useSetState<string>(displayableRows.map(_ => _.id!))
  const filteredRows = useMemo(() => displayableRows.filter(_ => displayedColumnsSet.has(_.id)), [rows, displayedColumnsSet])
  const displayTableHeader = useMemo(() => !!displayableRows.find(_ => _.head !== ''), [displayableRows])

  useEffect(() => {
    displayedColumnsSet.reset(displayableRows.map(_ => _.id!))
  }, [displayableRows])

  return (
    <>
      {(header || showColumnsToggle) && (
        <div className={css.header}>
          {header}
          {showColumnsToggle && (
            <DatatableColumnToggle
              className={css.btnColumnsToggle}
              columns={toggleableColumnsName}
              displayedColumns={displayedColumnsSet.toArray() as string[]}
              onChange={displayedColumnsSet.reset}
              title={showColumnsToggleBtnTooltip}
            />
          )}
        </div>
      )}
      <div className={css.container}>
        <Table className={classes(css.table)}>
          {displayTableHeader && (
            <TableHead>
              <TableRow>
                {filteredRows.map((_, i) => (
                  <TableCell key={i} className={classes(css.cellHeader, _.stickyEnd && css.stickyEnd)}>
                    {sort ? (
                      <TableSortLabel
                        active={sort.sortBy === _.id}
                        direction={sort.sortBy === _.id ? sort.orderBy : 'asc'}
                        onClick={() => sort.onSortChange({sortBy: _.id, orderBy: sort.orderBy === 'asc' ? 'desc' : 'asc'})}
                      >
                        {_.head}
                      </TableSortLabel>
                    ) : (
                      _.head
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={filteredRows.length} className={css.loadingTd}>
                  <LinearProgress className={css.loading} />
                </TableCell>
              </TableRow>
            )}
            {data?.map((item, i) => (
              <TableRow
                key={getRenderRowKey ? getRenderRowKey(item) : i}
                onClick={e => onClickRows?.(item, e)}
                className={classes(onClickRows && css.hoverableRows)}
              >
                {filteredRows.map((_, i) => (
                  <TableCell
                    key={i}
                    style={_.style}
                    className={classes(
                      typeof _.className === 'function' ? _.className(item) : _.className,
                      cssUtils.truncate,
                      _.stickyEnd && css.stickyEnd,
                    )}
                  >
                    {_.row(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {!loading && (!data || data?.length === 0) && (
              <TableRow>
                <TableCell colSpan={filteredRows.length} className={css.fenderContainer}>
                  {renderEmptyState ? renderEmptyState : <Fender title={m.noDataAtm} icon="highlight_off" />}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {paginate && total && (!paginate.minRowsBeforeDisplay || total > paginate.minRowsBeforeDisplay)
        ? (() => {
            const limit = safeParseInt(paginate.limit, 10)
            const offset = safeParseInt(paginate.offset, 0)
            return (
              <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={total ?? 0}
                rowsPerPage={limit}
                page={offset / limit}
                onPageChange={(event: unknown, newPage: number) => paginate.onPaginationChange({offset: newPage * limit})}
                onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  paginate.onPaginationChange({limit: +event.target.value})
                }
              />
            )
          })()
        : data && (
            <div className={css.paginate}>
              <span dangerouslySetInnerHTML={{__html: m.nLines(data.length)}} />
            </div>
          )}
    </>
  )
}
