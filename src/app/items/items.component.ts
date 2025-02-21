import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Item } from './item';
import { QueryParams } from '../models/query-params';
import { Subject } from 'rxjs';
import { debounceTime,distinctUntilChanged } from 'rxjs/operators';
import { ItemService } from './item.service';

@Component({
  selector: 'app-items',
  standalone: false,
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {
  public displayColumns: string[] = ['name','buy_Price',`sell_Price`,'item_Type'];
  public items!: MatTableDataSource<Item>;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";
  
  defaultPageIndex: number = 0;
  deafaultPageSize: number = 15;
  defaultFilterColumn: string = "name";
  filterQuery?:string;

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  
  filterTextChanged:Subject<string> = new Subject<string>();

  constructor(private itemService: ItemService){}

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
    this.itemService.getData(queryParams).subscribe({
        next: (result)=>
          {
            this.paginator.length = result.recordCount;
            this.paginator.pageIndex = result.pageIndex;
            this.paginator.pageSize = result.pageSize;
            this.items = new MatTableDataSource<Item>(result.data);
          },
          error: (error) => console.error(error)
        });
      }
    }
  
