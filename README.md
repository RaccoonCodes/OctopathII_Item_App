# Octopath II Item App

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.4.

# Overview 
This part of the project is the front-end of the main project "Octopath II Items". The back-end is completed with using .NET 8 and the repository of the project is in  `OctopathII_Items-API`. Both project must be used in order for the project to work, so please ensure you have both of them! or create your own API for this project.

**Note:**
Once this project is running, open your browser and navigate to `http://localhost:4200/`

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


