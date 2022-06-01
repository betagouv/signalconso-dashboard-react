import {
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Theme,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, {CSSProperties, ReactNode, useMemo} from 'react'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {classes} from '../../core/helper/utils'
import {DatatableColumnToggle} from './DatatableColumnsToggle'
import {useI18n} from '../../core/i18n'
import {Fender} from 'mui-extension/lib'
import {usePersistentState} from 'react-persistent-state/build'

type OrderBy = 'asc' | 'desc'

export interface DatatableProps<T> {
  id?: string
  header?: ReactNode
  actions?: ReactNode
  loading?: boolean
  total?: number
  data?: T[]
  getRenderRowKey?: (_: T) => string
  onClickRows?: (_: T, event: React.MouseEvent<HTMLTableRowElement>) => void
  columns: DatatableColumnProps<T>[]
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
    sortableColumns?: string[]
    sortBy?: string
    orderBy?: OrderBy
    onSortChange: (_: {sortBy?: string; orderBy?: OrderBy}) => void
  }
}

export interface DatatableColumnProps<T> {
  id: string
  head?: string | ReactNode
  render: (_: T) => ReactNode
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
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    minHeight: 52,
    borderBottom: `1px solid ${t.palette.divider}`,
    paddingLeft: t.spacing(1),
    paddingRight: t.spacing(1),
  },
  header_content: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  header_actions: {
    marginLeft: t.spacing(1),
    whiteSpace: 'nowrap',
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
    id,
    loading,
    total,
    data,
    columns,
    getRenderRowKey,
    actions,
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
  const displayableColumns = useMemo(() => columns.filter(_ => !_.hidden), [columns])
  const toggleableColumnsName = useMemo(
    () => displayableColumns.filter(_ => !_.alwaysVisible && _.head && _.head !== ''),
    [displayableColumns],
  )
  const [hiddenColumns, setHiddenColumns] = usePersistentState<string[]>([], id)
  const filteredColumns = useMemo(() => displayableColumns.filter(_ => !hiddenColumns.includes(_.id)), [columns, hiddenColumns])
  const displayTableHeader = useMemo(() => !!displayableColumns.find(_ => _.head !== ''), [displayableColumns])

  return (
    <>
      {(header || showColumnsToggle) && (
        <div className={css.header}>
          <div className={css.header_content}>{header}</div>
          <div className={css.header_actions}>
            {actions}
            {showColumnsToggle && (
              <DatatableColumnToggle
                className={css.btnColumnsToggle}
                columns={toggleableColumnsName}
                hiddenColumns={hiddenColumns}
                onChange={_ => setHiddenColumns(_)}
                title={showColumnsToggleBtnTooltip}
              />
            )}
          </div>
        </div>
      )}
      <div className={css.container} id={id}>
        <Table className={classes(css.table)}>
          {displayTableHeader && (
            <TableHead>
              <TableRow>
                {filteredColumns.map((_, i) => (
                  <TableCell key={i} className={classes(css.cellHeader, _.stickyEnd && css.stickyEnd)}>
                    {sort && (sort.sortableColumns?.includes(_.id) ?? true) ? (
                      <TableSortLabel
                        className={cssUtils.colorPrimary}
                        active={sort.sortBy === _.id}
                        direction={sort.sortBy === _.id ? sort.orderBy : 'asc'}
                        onClick={() => {
                          if (sort.sortBy === _.id && sort.orderBy === 'desc') {
                            sort.onSortChange({sortBy: undefined, orderBy: undefined})
                          } else {
                            sort.onSortChange({sortBy: _.id, orderBy: sort.orderBy === 'asc' ? 'desc' : 'asc'})
                          }
                        }}
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
                <TableCell colSpan={filteredColumns.length} className={css.loadingTd}>
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
                {filteredColumns.map((_, i) => (
                  <TableCell
                    key={i}
                    style={_.style}
                    className={classes(
                      typeof _.className === 'function' ? _.className(item) : _.className,
                      cssUtils.truncate,
                      _.stickyEnd && css.stickyEnd,
                    )}
                  >
                    {_.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {!loading && (!data || data?.length === 0) && (
              <TableRow>
                <TableCell colSpan={filteredColumns.length} className={css.fenderContainer}>
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
