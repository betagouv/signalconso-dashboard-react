import { Paginate } from '../model'

export const paginateData =
  <T>(limit: number, offset: number) =>
  (data: T[]): Paginate<T> => {
    return {
      entities: data.slice(offset, offset + limit),
      totalCount: data.length,
    }
  }
