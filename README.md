# Octopath II Item App

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.4.

# Overview 
This part of the project is the front-end of the main project "Octopath II Items". The back-end is completed with using .NET 8 and the repository of the project is in  `OctopathII_Items-API`. Both project must be used in order for the project to work, so please ensure you have both of them! or create your own API for this project.

**Note:**
Once this project is running, open your browser and navigate to `http://localhost:4200/`

The information about `Item` and `Equipment` is obtain via CSV which can be access or download on the README on `OctopathII_Items-API`

# Packages
The all packages used in this project is found in the `package.json` files. The Dependency list is long so I won't show them here.

The following sections will be about components and its functionality

# ApiResult interface
This interface class defines a response format for paginated api results. It gives metadata about response and infomation made to and from database. 
```typescript
export interface ApiResult<T> {
    data: T[];
    pageIndex: number;
    pageSize: number;
    recordCount: number;
    totalPages: number;
    message: string;
}

```
Since it is generic `<T>` it can be used for many different types of data types. It also provide, as mentioned earlier, metadata and any important messages.

# QueryParams
The main purpose of this one is to structure query parameters that may be needed when calling to the API. 
```typescript
export interface QueryParams {
    pageIndex: number;
    pageSize: number;
    sortColumn: string;
    sortOrder: string;
    filterColumn?:  string | null;
    filterQuery?:  string | null;
}
```
As shown above, it provides indexes, page size, sorting and optional filtering. 


# Base Service
This class is a generic and abstract class that is design to handle and manage request made to the API. Since this is an abstract class, it needs to extend to a more strongly type class that will override their functionality. The main purpose of creating this file is to make this functionality reusable for different types of serivce with different type of data. 

```typescript
protected getUrl(url:string) {
  return environment.baseUrl + url;
}

```
 This Constructs the full API endpoint URL by using the base URL from environment.baseUrl. 

```typescript
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
```
Constructs HTTP query parameters for filtering, sorting, and pagination when user provides them, otherwise a default is used.

Then the following uses abstract method for each child class to use and define.
```typescript
abstract getData(params:QueryParams):Observable<ApiResult<T>>;
abstract getDataID(name:string):Observable<T>;
abstract putData(item: T) : Observable<T>;
```
In general, the first two methods are used to retrieve a list of data while the other retrieves more information about the selected data. The `put` method updates existing data. 

# Base Form Component 
This abstract class hanles validations in forms. Same as previous abstract class, This was made so that different classes with different data types and objects can be used, following DRY principles. 

```typescript
getErrors(
  control: AbstractControl,
  displayName: string,
  customMessages: { [key: string]: string } | null = null
): string[] {
  var errors: string[] = [];
  Object.keys(control.errors || {}).forEach((key) => {
    switch (key) {
      case 'required':
        errors.push(`${displayName} ${customMessages?.[key] ?? "is required."}`);
        break;
      case 'pattern':
        errors.push(`${displayName} ${customMessages?.[key] ?? "contains invalid characters."}`);
        break;
      default:
        errors.push(`${displayName} is invalid.`);
        break;
    }
  });
  return errors;
}
```
This extracts and formats validation errors for a form control and it allows me to customise error messages. When it recieves errors from the form, it loops through all the errors associated with the form control. It assigns default messages for required and pattern errors. If it catches other errors, it also provides a fallback message for other validation errors. Then it returns an array of formatted error messages.

# Item
This interface class is a data model for object type Item that contains item name, description, pricing, and type,
```typescript
export interface Item{
    name:string;
    description:string;
    buy_Price:number;
    sell_Price:number;
    item_Type:string;
}
```
This is what information is used across the application when dealing with Item types. 

# Item Service
```typescript
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
  const url = this.getUrl("api/Items/PutItem");
  return this.http.put<Item>(url, item);
 }
```
The `ItemService` class extends `BaseService<Item>` and provides API interaction methods for retrieving and updating Item data. This service class is used in conjuction with `items.component`.

# ItemsComponent 
This component is responsible for displaying a paginated, sortable, and filterable list of `Item` objects using Angular Material's table `MatTableDataSource`. It interacts with the `ItemService` to fetch data from an API, handles user input for filtering, and updates the table dynamically.
```typescript
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
```
As mentioned before, this component handles data, pagination, sorting, filtering, and API interaction which all are used to set up information for the HTML aspect of it. A Debounce time is also implemented to reduce redundant API calls when users type quickly. This is applied to filter section in the UI/HTML part.

# Item Info Component
This component allows users to view and edit details of a specific item. 
```typescript
export class ItemInfoComponent extends BaseFormComponent implements OnInit {
  item!:Item;
  title?:string;
  itemForm!: FormGroup;
  itemID!:string;
  isEditMode:boolean = false;


  constructor(
    private activedRoute:ActivatedRoute, private itemService:ItemService,
    private fb:FormBuilder,private snackBar: MatSnackBar
  )
  {
    super()
  }

  ngOnInit() {
    this.form = this.fb.group({
      name:['',
        Validators.required
      ],
      description: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-zA-Z0-9].*[a-zA-Z0-9])[a-zA-Z0-9\s.,!?'"()-]{2,}$/)
      ]],
      buy_price: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{1,9}$/)
      ]],
      sell_price: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{1,9}$/)
      ]],
      item_type: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]{2,}$/)
      ]]
    });
  
    this.loadData();
  }
  

  loadData(){
    let idParam = this.activedRoute.snapshot.paramMap.get("name");
    this.itemID = idParam ?? '';

    this.itemService.getDataID(this.itemID).subscribe(item =>{
        this.item = item;
        this.isEditMode ? this.initializeForm(item,true) 
        : this.initializeForm(item,false);
    });
  }
  initializeForm(item: Item, editMode: boolean): void {
    this.item = item;
    this.title = (editMode ? "Edit" : "View") + " - " + item.name;
    this.form.patchValue({
      name: item.name,
      description: item.description,
      buy_price: item.buy_Price,
      sell_price: item.sell_Price,
      item_type: item.item_Type
    });
    editMode ? this.form.enable() : this.form.disable();
  }

  onMouseMove(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;

    const { left, top, width, height } = card.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    const rotateX = (deltaY / height) * 28; 
    const rotateY = (deltaX / width) * -28; 

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  onMouseLeave() {
    const card = document.querySelector('.item-card') as HTMLElement;
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }

  toggleEditMode():void{
    if (this.isEditMode) {
      // Delay hiding the form until animation completes
      setTimeout(() => {
        this.isEditMode = false;
        this.title = "View - " + this.item.name;
      }, 100);
    } else {
      this.isEditMode = true;
      this.title = "Edit - " + this.item.name;
    }
    this.isEditMode ? this.form.enable() : this.form.disable();
  }

  onCancel():void{
    this.isEditMode = false;
    this.loadData();
  }
  
  onSubmit(): void {
    if (this.form.valid) {
      const updatedItem: Item = { ...this.item, ...this.form.value };
  
      this.itemService.putData(updatedItem).subscribe({
        next: () => {
          this.isEditMode = false;
          this.snackBar.open('Changes saved successfully!', 'Close', {
            duration: 3000, // Snackbar disappears after 3 seconds
            panelClass: ['snackbar-success'] 
          });
          this.loadData(); 
        },
        error: (error) => {
          console.error('Error updating item', error);
        }
      });
    } else {
      console.log('Form is not valid!');
    }
  }
```

Similar to `items.component` This handles the information that is being used in the HTML. In the UI, it uses a card form view information of the Item and, at the same time, it handles the edit section when updating information of the item. When the update is complete, it changes to view mode and creates a little notification bar notifying the user that the changes was successful. 


# Equipment
To shorten the README Section, I won't go too much in detail for equipment, has it almost follow similar structure as Item. Instead of using `Item` as its data type, it uses `equipment` which contains the following:
```typescript
export interface Equipment{
    name: string;
    max_Hp: number;
    max_SP: number;
    physical_Atk: number;
    elemental_Atk: number;
    physical_Def: number;
    elemental_Def: number;
    accuracy: number;
    speed: number;
    critical: number;
    evasion: number;
    effect: string;
    buy_Price: number;
    sell_Price: number;
    equipment_Type: string;
}
```

As shown above, the item has fewer properties to display while the equipment has more properties to show in greater detail what each equipment does in the game. 

# Conclusion

This project is the Front-end section for Octopath Traveller II Items. The Back-end is made with .NET 8 which can be downloaded in my GitHub repertoire. This is one of the many Angular/.NET project I have created. In terms of update, there probably won't be any in the future for this particular project, however I will continue to work on other project.

**Note:** There will more projects that I will work on. Some with a mix of Angular 19/.NET 8 and some with Full on .NET MVC or .NET Razor Pages. Last update on this project is on 2/26/2025

Have a Nice Day!

