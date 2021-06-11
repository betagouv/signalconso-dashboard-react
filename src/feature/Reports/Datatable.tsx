import {LinearProgress, makeStyles, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Theme} from '@material-ui/core'
import React, {CSSProperties, ReactNode, useMemo} from 'react'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {classes} from '../../core/helper/utils'
import {DatatableColumnToggle} from './DatatableColumnsToggle'
import {useSetState} from '@alexandreannic/react-hooks-lib/lib'

export interface DatatableBaseProps<T> {
  loading?: boolean
  total?: number
  data?: T[]
  getRenderRowKey?: (_: T) => string
  rows: DatatableColumnProps<T>[]
  displayToggleColumnBtnQuerySelector?: string
}

export interface DatatablePaginatedProps<T> extends DatatableBaseProps<T> {
  offset: number,
  limit: number
  onChangeOffset: (_: number) => void
  onChangeLimit: (_: number) => void
}

export type DatatableProps<T> = DatatableBaseProps<T> | DatatablePaginatedProps<T>

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
  if (_.total !== undefined) {
    return _.total > ((_ as DatatablePaginatedProps<T>).limit ?? 0)
  }
  return false
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
  header: {
    color: t.palette.text.secondary
  },
  btnColumnsToggle: {
    position: 'absolute',
    right: 0,
    top: 0,
  }
}))

const safeParseInt = (maybeInt: any, defaultValue: number): number => isNaN(maybeInt) ? defaultValue : parseInt(maybeInt)

export const Datatable = <T extends any = any>(props: DatatableProps<T>) => {
  const {
    loading,
    total,
    data,
    rows,
    getRenderRowKey,
    displayToggleColumnBtnQuerySelector,
  } = props

  const css = useStyles()
  const cssUtils = useUtilsCss()
  const displayableRows = useMemo(() => rows.filter(_ => !_.hidden), [rows])
  const columnsName = useMemo(() => displayableRows.map(_ => _.name), [rows])
  const displayedColumnsSet = useSetState<string>(columnsName)
  const filteredRows = useMemo(() => displayableRows.filter(_ => displayedColumnsSet.has(_.name)), [rows, displayedColumnsSet])

  return (
    <>
      <div className={css.container}>
        <Table className={classes(css.table)}>
          <TableHead>
            <TableRow>
              {filteredRows.map((_, i) =>
                <TableCell key={i} className={classes(css.header, _.stickyEnd && css.stickyEnd)}>
                  {_.head ?? _.name}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={filteredRows.length} style={{height: 0, padding: 0, position: 'relative', border: 'none'}}>
                  <LinearProgress style={{position: 'absolute', right: 0, left: 0}}/>
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
        </TableBody>
        </Table>
        <DatatableColumnToggle
          className={css.btnColumnsToggle}
          columns={columnsName}
          displayedColumns={displayedColumnsSet.toArray()}
          onChange={displayedColumnsSet.reset}
        />
      </div>
      {isDatatablePaginatedProps(props) && (() => {
        const limit = safeParseInt(props.limit, props.data?.length ?? 10)
        const offset = safeParseInt(props.offset, 0)
        return (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={total ?? 0}
            rowsPerPage={limit}
            page={offset / limit}
            onChangePage={(event: unknown, newPage: number) => props.onChangeOffset(newPage * limit)}
            onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) => props.onChangeLimit(parseInt(event.target.value, 10))}
          />
        )
      })()}
    </>
  )
}
