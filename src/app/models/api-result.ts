export interface ApiResult<T> {
    data: T[];
    pageIndex: number;
    pageSize: number;
    recordCount: number;
    totalPages: number;
    message: string;
    // sortColumn: string;
    // sortOrder: string;
    // filterColumn: string;
    // filterQuery: string;
  
  }