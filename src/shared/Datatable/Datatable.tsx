import {
  LinearProgress,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Theme,
} from '@mui/material'
import React, { CSSProperties, ReactNode, useMemo } from 'react'
import { Fender } from '../../alexlibs/mui-extension'
import { usePersistentState } from '../../alexlibs/react-persistent-state'
import { useI18n } from '../../core/i18n'
import { combineSx, sxUtils } from '../../core/theme'
import { DatatableColumnToggle } from './DatatableColumnsToggle'

type OrderBy = 'asc' | 'desc'

interface DatatableProps<T> {
  id?: string
  // arbitrary content above the header, typically to provide some explications
  superheader?: ReactNode
  // the main part of the header, slightly on the left
  // it can be anything but we typically put here some search inputs,
  // or a DatatableToolbar (which is typically displayed only when we select some rows)
  headerMain?: ReactNode
  // some arbitrary buttons that appear directly to the right of the headerMain
  actions?: ReactNode
  // an additional button (added to the actions) to control which columns are displayed or not
  showColumnsToggle?: boolean
  // make this button displayed with big text, instead of just an icon
  plainTextColumnsToggle?: boolean
  // adds a small bottom margin to the header
  headerMarginBottom?: boolean
  loading?: boolean
  total?: number
  data?: T[]
  getRenderRowKey?: (_: T) => string
  onClickRows?: (_: T, event: React.MouseEvent<HTMLTableRowElement>) => void
  columns: DatatableColumnProps<T>[]
  initialHiddenColumns?: string[]
  renderEmptyState?: ReactNode
  rowsPerPageExtraOptions?: number[]
  paginate?: {
    minRowsBeforeDisplay?: number
    offset: number
    limit: number
    onPaginationChange: (_: { offset?: number; limit?: number }) => void
  }
  sort?: {
    sortableColumns?: string[]
    sortBy?: string
    orderBy?: OrderBy
    onSortChange: (_: { sortBy?: string; orderBy?: OrderBy }) => void
  }
  rowSx?: (_: T) => SxProps<Theme> | undefined
}

export interface DatatableColumnProps<T> {
  id: string
  head?: string | ReactNode
  render: (_: T) => ReactNode
  hidden?: boolean
  alwaysVisible?: boolean
  className?: string | ((_: T) => string | undefined)
  sx?: (_: T) => SxProps<Theme> | undefined
  style?: CSSProperties
  stickyEnd?: boolean
  onClick?: (_: T, event: React.MouseEvent<HTMLTableCellElement>) => void
}

const safeParseInt = (maybeInt: any, defaultValue: number): number =>
  isNaN(maybeInt) ? defaultValue : parseInt(maybeInt)

const sxStickyEnd: SxProps<Theme> = {
  paddingTop: '1px',
  position: 'sticky',
  right: 0,
  zIndex: 1, // Otherwise, badges are visible over the sticky element
  background: (t) => t.palette.background.paper,
}

export const Datatable = <T extends any = any>({
  id,
  loading,
  total,
  data,
  columns,
  initialHiddenColumns,
  getRenderRowKey,
  actions,
  headerMain,
  headerMarginBottom,
  superheader,
  showColumnsToggle,
  renderEmptyState,
  rowsPerPageExtraOptions = [],
  sort,
  onClickRows,
  paginate,
  plainTextColumnsToggle,
  rowSx,
}: DatatableProps<T>) => {
  const { m } = useI18n()
  const displayableColumns = useMemo(
    () => columns.filter((_) => !_.hidden),
    [columns],
  )
  const toggleableColumnsName = useMemo(
    () =>
      displayableColumns.filter(
        (_) => !_.alwaysVisible && _.head && _.head !== '',
      ),
    [displayableColumns],
  )
  const [hiddenColumns, setHiddenColumns] = usePersistentState<string[]>(
    initialHiddenColumns ?? [],
    id,
  )
  const filteredColumns = useMemo(
    () => displayableColumns.filter((_) => !hiddenColumns.includes(_.id)),
    [columns, hiddenColumns],
  )
  const displayTableHeader = useMemo(
    () => !!displayableColumns.find((_) => !!_.head),
    [displayableColumns],
  )

  return (
    <div className="mb-4">
      {superheader && <div className="py-4 px-2">{superheader}</div>}
      {(headerMain || showColumnsToggle || actions) && (
        <div
          className={`relative flex flex-wrap items-center min-h-[52px] gap-2 ${
            headerMarginBottom ? 'mb-2' : ''
          }`}
        >
          <div className="flex items-center flex-grow">{headerMain}</div>
          <div className="whitespace-nowrap flex gap-2">
            {actions}
            {showColumnsToggle && (
              <DatatableColumnToggle
                // style={{marginLeft: 'auto'}}
                columns={toggleableColumnsName}
                hiddenColumns={hiddenColumns}
                plainTextButton={plainTextColumnsToggle}
                onChange={(_) => setHiddenColumns(_)}
                title={m.toggleDatatableColumns}
              />
            )}
          </div>
        </div>
      )}
      <div
        className="overflow-auto relative border border-solid border-gray-300"
        id={id}
      >
        <Table
          sx={{
            borderCollapse: 'separate', // Sticky elements don't have any border otherwise
            minWidth: '100%',
            tableLayout: 'fixed',
            width: 'auto', // Override width: 100% from Material-UI that breaks sticky columns
          }}
        >
          {displayTableHeader && (
            <TableHead>
              <TableRow>
                {filteredColumns.map((_, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      color: (t) => t.palette.text.secondary,
                      ...(_.stickyEnd && sxStickyEnd),
                    }}
                  >
                    {sort && (sort.sortableColumns?.includes(_.id) ?? true) ? (
                      <TableSortLabel
                        sx={{ color: (t) => t.palette.primary.main }}
                        active={sort.sortBy === _.id}
                        direction={sort.sortBy === _.id ? sort.orderBy : 'asc'}
                        onClick={() => {
                          if (sort.sortBy === _.id && sort.orderBy === 'desc') {
                            sort.onSortChange({
                              sortBy: undefined,
                              orderBy: undefined,
                            })
                          } else {
                            sort.onSortChange({
                              sortBy: _.id,
                              orderBy: sort.orderBy === 'asc' ? 'desc' : 'asc',
                            })
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
                <TableCell
                  colSpan={filteredColumns.length}
                  sx={{
                    height: 0,
                    marginBottom: '-1px',
                    padding: 0,
                    border: 'none',
                  }}
                >
                  <LinearProgress />
                </TableCell>
              </TableRow>
            )}
            {data?.map((item, i) => (
              <TableRow
                key={getRenderRowKey ? getRenderRowKey(item) : i}
                onClick={(e) => onClickRows?.(item, e)}
                sx={{
                  ...rowSx?.(item),
                  ...(onClickRows && {
                    '&:hover': {
                      background: (t) => t.palette.action.hover,
                    },
                  }),
                }}
              >
                {filteredColumns.map((_, i) => (
                  <TableCell
                    key={i}
                    onClick={(e) => _.onClick?.(item, e)}
                    sx={
                      _.stickyEnd
                        ? combineSx(_.sx?.(item), sxUtils.truncate, sxStickyEnd)
                        : combineSx(_.sx?.(item), sxUtils.truncate)
                    }
                    style={{ ..._.style }}
                    className={
                      typeof _.className === 'function'
                        ? _.className(item)
                        : _.className
                    }
                  >
                    {_.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {!loading && (!data || data?.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={filteredColumns.length}
                  sx={{ p: 2, textAlign: 'center', borderBottom: 0 }}
                >
                  {renderEmptyState ? (
                    renderEmptyState
                  ) : (
                    <Fender title={m.noDataAtm} icon="highlight_off" />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {paginate &&
      total &&
      (!paginate.minRowsBeforeDisplay || total > paginate.minRowsBeforeDisplay)
        ? (() => {
            const limit = safeParseInt(paginate.limit, 10)
            const offset = safeParseInt(paginate.offset, 0)
            return (
              <TablePagination
                rowsPerPageOptions={[10, 25, 100, ...rowsPerPageExtraOptions]}
                component="div"
                labelRowsPerPage="Nombre d'éléments à afficher"
                count={total ?? 0}
                rowsPerPage={limit}
                page={Math.round(offset / limit)}
                onPageChange={(event: unknown, newPage: number) =>
                  paginate.onPaginationChange({ offset: newPage * limit })
                }
                onRowsPerPageChange={(
                  event: React.ChangeEvent<HTMLInputElement>,
                ) =>
                  paginate.onPaginationChange({ limit: +event.target.value })
                }
              />
            )
          })()
        : null}
    </div>
  )
}
