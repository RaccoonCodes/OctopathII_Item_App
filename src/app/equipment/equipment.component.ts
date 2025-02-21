import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QueryParams } from '../models/query-params';
import { Subject } from 'rxjs';
import { debounceTime,distinctUntilChanged } from 'rxjs/operators';
import { Equipment } from './equipment';
import { EquipmentService } from './equipment.service';

@Component({
  selector: 'app-equipment',
  standalone: false,
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss'
})
export class EquipmentComponent implements OnInit {
  public displayColumns: string[] = ['name','buy_Price',`sell_Price`,'equipment_Type'];
  public equipment!: MatTableDataSource<Equipment>;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";

  defaultPageIndex: number = 0;
  deafaultPageSize: number = 15;
  defaultFilterColumn: string = "name";
  filterQuery?:string;

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  
  filterTextChanged:Subject<string> = new Subject<string>();

  constructor(private equipmentService:EquipmentService){}

   ngOnInit() {
      this.loadData();
    }
  
    onFilterTextChanged(filterText: string){
      if (!this.filterTextChanged.observed) {
        this.filterTextChanged
          .pipe(debounceTime(900), distinctUntilChanged())
          .subscribe(query => {
            this.loadData(query);
          });
      }
      this.filterTextChanged.next(filterText);
    }
  
    loadData(query?:string){
      var pageEvent = new PageEvent();
      pageEvent.pageIndex = this.defaultPageIndex;
      pageEvent.pageSize = this.deafaultPageSize;
      this.filterQuery = query;
      this.getInfo(pageEvent);
    }
    getInfo(event: PageEvent){
      var sortColumn = (this.sort) 
      ? this.sort.active : this.defaultSortColumn;
      var sortOrder = (this.sort) 
      ? this.sort.direction : this.defaultSortOrder;
      var filterColumn = (this.filterQuery)
      ? this.defaultFilterColumn : null;
      var filterQuery = (this.filterQuery)
      ? this.filterQuery : null;
  
      const queryParams: QueryParams = {
        pageIndex: event.pageIndex,
        pageSize: event.pageSize,
        sortColumn: sortColumn,
        sortOrder: sortOrder,
        filterColumn: filterColumn,
        filterQuery: filterQuery
      };
      this.equipmentService.getData(queryParams).subscribe({
          next: (result)=>
            {
              this.paginator.length = result.recordCount;
              this.paginator.pageIndex = result.pageIndex;
              this.paginator.pageSize = result.pageSize;
              this.equipment = new MatTableDataSource<Equipment>(result.data);
            },
            error: (error) => console.error(error)
          });
        }



}
