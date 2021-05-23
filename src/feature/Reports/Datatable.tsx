import {LinearProgress, makeStyles, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Theme} from '@material-ui/core'
import React, {ReactNode} from 'react'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {classes} from '../../core/helper/utils'

export interface DatatableBaseProps<T> {
  loading?: boolean
  total?: number
  data?: T[]
  getRenderRowId?: (_: T) => string
  rows: DatatableColumnProps<T>[]
}

export interface DatatablePaginatedProps<T> extends DatatableBaseProps<T> {
  offset: number,
  limit: number
  onChangeOffset: (_: number) => void
  onChangeLimit: (_: number) => void
}

export type DatatableProps<T> = DatatableBaseProps<T> | DatatablePaginatedProps<T>

export interface DatatableColumnProps<T> {
  sortName?: string
  head: string | ReactNode
  row: (_: T) => ReactNode
  hidden?: boolean
  className?: string,
}

const isDatatablePaginatedProps = <T, >(_: DatatableProps<T>): _ is DatatablePaginatedProps<T> => (_ as DatatablePaginatedProps<T>).offset !== undefined

const useStyles = makeStyles((t: Theme) => ({
  table: {
    minWidth: '100%',
    tableLayout: 'fixed'
  }
}))

export const Datatable = <T extends any = any>(props: DatatableProps<T>) => {

  console.log(props)

  const {
    loading,
    total,
    data,
    rows,
    getRenderRowId,
  } = props

  const css = useStyles()
  const cssUtils = useUtilsCss()
  const filteredRows = rows.filter(_ => !_.hidden)

  return (
    <div style={{overflowX: 'scroll'}}>
      <Table className={classes(cssUtils.truncate, css.table)}>
        <TableHead>
          <TableRow>
            {filteredRows.map((_, i) =>
              <TableCell key={i}>
                {_.head}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={filteredRows.length} style={{padding: 0, position: 'relative', border: 'none'}}>
                <LinearProgress style={{position: 'absolute', right: 0, left: 0}}/>
              </TableCell>
            </TableRow>
          )}
          {data?.map((item, i) =>
            <TableRow key={getRenderRowId ? getRenderRowId(item) : i}>
              {filteredRows.map((_, i) =>
                <TableCell key={i} className={classes(_.className, cssUtils.truncate)}>
                  {_.row(item)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isDatatablePaginatedProps(props) && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={total ?? 0}
          rowsPerPage={props.limit}
          page={props.offset / props.limit}
          onChangePage={(event: unknown, newPage: number) => props.onChangeOffset(newPage * props.limit)}
          onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) => props.onChangeLimit(parseInt(event.target.value, 10))}
        />
      )}
    </div>
  )
}
