import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.development";
import { QueryParams } from "./models/query-params";
import { ApiResult } from "./models/api-result";

export abstract class BaseService<T> {
  constructor(protected http:HttpClient) { }
  protected getUrl(url:string){
    return environment.baseUrl + url;
  }
  abstract getData(params:QueryParams):Observable<ApiResult<T>>;
  // abstract putData(item: T) : Observable<T>
  // abstract postData(item:T) : Observable<T>
}


