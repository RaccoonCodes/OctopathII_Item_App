# Octopath II Item App

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.4.

# Overview 
This part of the project is the front-end of the main project "Octopath II Items". The back-end is completed with using .NET 8 and the repository of the project is in  `OctopathII_Items-API`. Both project must be used in order for the project to work, so please ensure you have both of them! or create your own API for this project.

**Note:**
Once this project is running, open your browser and navigate to `http://localhost:4200/`

# Packages
The all packages used in this project is found in the `package.json` files. The Dependency list is long so I won't show them here.

The following sections will be about components and its functionality

## Home Component
This component is the starting component of the application. So when the application get loaded, this is what they will see. The main, or global, html is `index` which will only display the `nav-menu` globally. So far, this will just display a short paragraph about this project.

### Angular material 
This module manages imports and exports for Angular Material component that can be used globally. 
By uing this we can reuse theses components in multiple sections of the application.
```typescript
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
  ],
  exports:[
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,

  ]

})
export class AngularMaterialModule { }

```
Which gets registered in the `app.module` component
```typescript
import {AngularMaterialModule} from '../angular-material.module';
```
## Items
This folder houses component related to items. 

### item.ts
```typescript
export interface Item{
    name:string;
    description:string;
    buy_price:number;
    sell_price:number;
    item_type:string;
}
```
This interface holds information needed for information to hold and the type of information it will contain for the object type Item.

### item component

## Nav menu
This navigation will hold the links that the user can take. it is tied to the attribute `[routerLink]`
for example:
```typescript
    <a mat-flat-button [routerLink]="['/items']">
```





