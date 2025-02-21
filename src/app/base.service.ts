import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.development";
import { QueryParams } from "./models/query-params";
import { ApiResult } from "./models/api-result";

export abstract class BaseService<T> {
  constructor(protected http:HttpClient) { }
  protected getUrl(url:string){
    return environment.baseUrl + url;
  }
  protected getQueryParams(params: QueryParams): HttpParams {
    let queryParams = new HttpParams()
      .set("pageIndex", params.pageIndex.toString())
      .set("pageSize", params.pageSize.toString())
      .set("sortColumn", params.sortColumn)
      .set("sortOrder", params.sortOrder);

    if (params.filterColumn && params.filterQuery) {
      queryParams = queryParams
        .set("filterColumn", params.filterColumn)
        .set("filterQuery", params.filterQuery);
    }

    return queryParams;
  }

  abstract getData(params:QueryParams):Observable<ApiResult<T>>;
  // abstract putData(item: T) : Observable<T>
  // abstract postData(item:T) : Observable<T>
}


