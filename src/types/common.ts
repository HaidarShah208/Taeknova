export type ID = string;

export type Maybe<T> = T | null | undefined;

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorShape {
  status: number;
  message: string;
  details?: Record<string, string[]>;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
