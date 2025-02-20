import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from '../base.service';
import { ApiResult } from '../models/api-result';
import { Observable } from 'rxjs';
import { Item } from './item';
import { QueryParams } from '../models/query-params';

@Injectable({
  providedIn: 'root'
})
export class ItemService extends BaseService<Item> {

  constructor(http: HttpClient) {
    super(http);
  }
 override getData(params: QueryParams): Observable<ApiResult<Item>> {
   var url = this.getUrl("api/Items/GetItems");

   var queryParams = new HttpParams()
   .set("pageIndex", params.pageIndex.toString())
   .set("pageSize", params.pageSize.toString())
   .set("sortColumn", params.sortColumn)
   .set("sortOrder", params.sortOrder);

   if(params.filterColumn && params.filterQuery){
    queryParams = queryParams
    .set("filterColumn", params.filterColumn)
    .set("filterQuery", params.filterQuery);
   }

   return this.http.get<ApiResult<Item>>(url,{params:queryParams});

 }


}
