import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ItemsComponent } from './items/items.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { ItemInfoComponent } from './items/item-info.component';
import { EquipmentInfoComponent } from './equipment/equipment-info.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'items', component: ItemsComponent },
  { path:'items/:name', component:ItemInfoComponent },
  { path:'equipment', component:EquipmentComponent },
  { path: 'equipment/:name',component:EquipmentInfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
