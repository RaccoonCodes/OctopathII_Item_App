import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
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
  const url = this.getUrl("api/Items/GetItems");
  return this.http.get<ApiResult<Item>>(url, { params: this.getQueryParams(params) });
 }
 override getDataID(name: string): Observable<Item> {
  const url = this.getUrl(`api/Items/GetInfo?name=${encodeURIComponent(name)}`);
  return this.http.get<Item>(url);
 }
 override putData(item: Item): Observable<Item> {
  const url = this.getUrl("api/Items/GetInfo");
  return this.http.put<Item>(url, item);
 }


}
