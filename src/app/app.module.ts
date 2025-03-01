import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularMaterialModule } from '../angular-material.module';
import { ItemsComponent } from './items/items.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { ItemInfoComponent } from './items/item-info.component'
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { EquipmentInfoComponent } from './equipment/equipment-info.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavMenuComponent,
    ItemsComponent,
    EquipmentComponent,
    ItemInfoComponent,
    EquipmentInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSnackBarModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
