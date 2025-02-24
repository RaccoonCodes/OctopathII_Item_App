import { Component, OnInit } from '@angular/core';
import { Item } from './item';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from './item.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseFormComponent } from '../base-form.component';

@Component({
  selector: 'app-item-info',
  standalone: false,
  templateUrl: './item-info.component.html',
  styleUrl: './item-info.component.scss'
})
export class ItemInfoComponent extends BaseFormComponent implements OnInit {
  item!:Item;
  title?:string;
  itemForm!: FormGroup;
  itemID!:string;
  isEditMode:boolean = false;


  constructor(
    private activedRoute:ActivatedRoute, private itemService:ItemService,
    private fb:FormBuilder
  )
  {
    super()
  }

  ngOnInit() {
    this.form = this.fb.group({
      description: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{2,}$/)
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
    let idParam = this.activedRoute.snapshot.paramMap.get('name');
    this.itemID = idParam ?? '';

    this.itemService.getDataID(this.itemID).subscribe(item =>{
      this.item = item;
      this.isEditMode ? this.initializeEditMode(item) 
      : this.initializeViewMode(item);

    });
  }

  initializeViewMode(item:Item):void{
    this.item = item;
    this.title = "View - " + this.item.name;

    this.form.patchValue({
      name: item.name,
      description: item.description,
      buy_price: item.buy_price,
      sell_price: item.sell_price,
      item_type: item.item_type
    });
    this.form.disable();
  }

  initializeEditMode(item:Item):void{
    this.item = item;
    this.title = "Edit - " + this.item.name;

    this.form.patchValue({
      description: item.description,
      buy_price: item.buy_price,
      sell_price: item.sell_price,
      item_type: item.item_type
    });

    this.form.enable();
  }

  toggleEditMode():void{
    this.isEditMode = !this.isEditMode;
    this.loadData(); //Reload data and switch modes
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
  


}
