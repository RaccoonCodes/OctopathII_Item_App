import { Component, OnInit } from '@angular/core';
import { Item } from './item';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from './item.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseFormComponent } from '../base-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      buy_price: item.buy_Price,
      sell_price: item.sell_Price,
      item_type: item.item_Type
    });
    this.form.disable();
  }

  initializeEditMode(item:Item):void{
    this.item = item;
    this.title = "Edit - " + this.item.name;

    this.form.patchValue({
      name: item.name,
      description: item.description,
      buy_price: item.buy_Price,
      sell_price: item.sell_Price,
      item_type: item.item_Type
    });

    this.form.enable();
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
    this.loadData();
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
  


}
