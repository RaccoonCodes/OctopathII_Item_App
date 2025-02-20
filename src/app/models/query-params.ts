export interface QueryParams {
    pageIndex: number;
    pageSize: number;
    sortColumn: string;
    sortOrder: string;
    filterColumn?:  string | null;
    filterQuery?:  string | null;
}
