import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Item } from './item';
import { Subject } from 'rxjs';
import { debounceTime,distinctUntilChanged } from 'rxjs/operators';
//Add service for item here 

@Component({
  selector: 'app-items',
  standalone: false,
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {
  public displayColumns: string[] = ['name','buy_price',`sell_price`,'item_type'];
  public items!: MatTableDataSource<Item>;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "ASC" | "DESC" = "ASC";

  defaultPageIndex: number = 0;
  deafaultPageSize: number = 15;
  defaultFilterColumn: string = "name";
  filterQuery?:string;

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  
  filterTextChanged:Subject<string> = new Subject<string>();

  //Add constructor here for service
  

}
