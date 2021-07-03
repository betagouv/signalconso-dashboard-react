import {LinearProgress, makeStyles, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Theme} from '@material-ui/core'
import React, {CSSProperties, ReactNode, useMemo} from 'react'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {classes} from '../../core/helper/utils'
import {DatatableColumnToggle} from './DatatableColumnsToggle'
import {useSetState} from '@alexandreannic/react-hooks-lib/lib'
import {useI18n} from '../../core/i18n'

type OrderBy = 'asc' | 'desc'

export interface DatatableBaseProps<T> {
  header?: ReactNode
  loading?: boolean
  total?: number
  data?: T[]
  getRenderRowKey?: (_: T) => string
  rows: DatatableColumnProps<T>[]
  showColumnsToggle?: boolean
  showColumnsToggleBtnTooltip?: string
  renderEmptyState?: ReactNode
  rowsPerPageOptions?: number[]
}

export interface DatatableSortedProps<T> extends DatatableBaseProps<T> {
  sortBy: string
  orderBy: OrderBy
  onSortChange: (_: {sortBy: string, orderBy: OrderBy}) => void
}

export interface DatatablePaginatedProps<T> extends DatatableBaseProps<T> {
  offset: number,
  limit: number
  onPaginationChange: (_: {offset?: number, limit?: number}) => void
}

// TODO(Alex) Fix it: for example, when offset is set but not limit, and TypeError should be thrown
export type DatatableProps<T> = DatatableBaseProps<T>
  | DatatablePaginatedProps<T>
  | DatatableSortedProps<T>
  | DatatableSortedProps<T> & DatatablePaginatedProps<T>

export interface DatatableColumnProps<T> {
  name: string
  head?: string | ReactNode
  row: (_: T) => ReactNode
  hidden?: boolean
  className?: string,
  style?: CSSProperties
  stickyEnd?: boolean
}

const isDatatablePaginatedProps = <T, >(_: DatatableProps<T>): _ is DatatablePaginatedProps<T> => {
  return _.total !== undefined || (_ as DatatablePaginatedProps<T>).limit !== undefined
  // if (_.total !== undefined || limit !== undefined) {
    // return _.total > ((_ as DatatablePaginatedProps<T>).limit ?? 0)
  // }
  // return false
}

const isDatatableSortedProps = <T, >(_: DatatableProps<T>): _ is DatatableSortedProps<T> => {
  return !!(_ as DatatableSortedProps<T>).onSortChange
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
    color: t.palette.text.secondary
  },
  btnColumnsToggle: {
    marginLeft: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 52,
    borderBottom: `1px solid ${t.palette.divider}`,
    paddingLeft: t.spacing(1),
    paddingRight: t.spacing(1),
  }
}))

const safeParseInt = (maybeInt: any, defaultValue: number): number => isNaN(maybeInt) ? defaultValue : parseInt(maybeInt)

export const Datatable = <T extends any = any,>(props: DatatableProps<T>) => {
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
  } = props

  const css = useStyles()
  const cssUtils = useUtilsCss()
  const displayableRows = useMemo(() => rows.filter(_ => !_.hidden), [rows])
  const displayedColumnsSet = useSetState<string>(displayableRows.map(_ => _.name!))
  const filteredRows = useMemo(() => displayableRows.filter(_ => displayedColumnsSet.has(_.name)), [rows, displayedColumnsSet])

  return (
    <>
      {(header || showColumnsToggle) && (
        <div className={css.header}>
          {header}
          {showColumnsToggle && (
            <DatatableColumnToggle
              className={css.btnColumnsToggle}
              columns={displayableRows}
              displayedColumns={displayedColumnsSet.toArray() as string[]}
              onChange={displayedColumnsSet.reset}
              title={showColumnsToggleBtnTooltip}
            />
          )}
        </div>
      )}
      <div className={css.container}>
        <Table className={classes(css.table)}>
          <TableHead>
            <TableRow>
              {filteredRows.map((_, i) =>
                <TableCell
                  key={i}
                  className={classes(css.cellHeader, _.stickyEnd && css.stickyEnd)}
                >
                  {isDatatableSortedProps(props) ? (
                    <TableSortLabel
                      active={props.sortBy === _.name}
                      direction={props.sortBy === _.name ? props.orderBy : 'asc'}
                      onClick={() => props.onSortChange({sortBy: _.name, orderBy: props.orderBy === 'asc' ? 'desc' : 'asc'})}
                    >
                      {_.head}
                    </TableSortLabel>

                  ) : (
                    _.head
                  )}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={filteredRows.length} style={{height: 0, padding: 0, border: 'none'}}>
                  <LinearProgress/>
                </TableCell>
              </TableRow>
            )}
            {data?.map((item, i) =>
              <TableRow key={getRenderRowKey ? getRenderRowKey(item) : i}>
                {filteredRows.map((_, i) =>
                  <TableCell key={i} className={classes(_.className, cssUtils.truncate, _.stickyEnd && css.stickyEnd)} style={_.style}>
                    {_.row(item)}
                  </TableCell>
                )}
              </TableRow>
            )}
            {data?.length === 0 && renderEmptyState && (
              <TableRow>
                <TableCell colSpan={filteredRows.length}>
                  {renderEmptyState}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isDatatablePaginatedProps(props) && (() => {
        const limit = safeParseInt(props.limit, 10)
        const offset = safeParseInt(props.offset, 0)
        return (
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={total ?? 0}
            rowsPerPage={limit}
            page={offset / limit}
            onChangePage={(event: unknown, newPage: number) => props.onPaginationChange({offset: newPage * limit})}
            onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) => props.onPaginationChange({limit: +event.target.value})}
          />
        )
      })()}
    </>
  )
}
