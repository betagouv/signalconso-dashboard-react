import { OrderBy, Paginate } from '../model'

export const paginateData =
  <T>(limit: number, offset: number) =>
  (data: T[]): Paginate<T> => {
    return {
      entities: data.slice(offset, offset + limit),
      totalCount: data.length,
    }
  }

export const sortData = <T>(
  data: T[],
  sortBy: keyof T,
  orderBy: OrderBy,
): T[] => {
  return data.sort(
    (a, b) =>
      ('' + a[sortBy]).localeCompare('' + b[sortBy]) *
      (orderBy === 'desc' ? -1 : 1),
  )
}
