import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BaseService } from '../base.service';
import { ApiResult } from '../models/api-result';
import { Observable } from 'rxjs';
import { QueryParams } from '../models/query-params';
import { Equipment } from './equipment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends BaseService<Equipment> {

  constructor(http: HttpClient) {
    super(http);
   }

   override getData(params: QueryParams): Observable<ApiResult<Equipment>> {
     const url = this.getUrl("api/Equipment/GetEquipment");     
     return this.http.get<ApiResult<Equipment>>(url,{params:this.getQueryParams(params)});
   }
   override getDataID(name: string): Observable<Equipment> {
    const url = this.getUrl(`api/Equipment/GetInfo?name=${encodeURIComponent(name)}`); 
    return this.http.get<Equipment>(url);
  }
   override putData(equipment: Equipment): Observable<Equipment> {
    const url = this.getUrl("api/Equipment/PutEquipment");
    return this.http.put<Equipment>(url, equipment);
   }

}
