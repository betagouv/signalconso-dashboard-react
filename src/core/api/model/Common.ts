export type Id = string;

export interface Entity {
  id: Id;
}

export interface PaginatedData<T> {
  totalCount: number;
  hasNextPage: boolean;
  entities: Array<T>;
}
