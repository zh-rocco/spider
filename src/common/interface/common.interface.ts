export interface ListResponse<T> {
  result: 0 | 1;
  data: T[];
  total: number;
}

export interface ListQuery {
  page?: string;
  count?: string;
}

export interface CommonResponse<T> {
  result: 0 | 1;
  data: T;
}
