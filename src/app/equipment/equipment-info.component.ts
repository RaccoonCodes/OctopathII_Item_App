import { Component, OnInit } from '@angular/core';
import { Equipment } from './equipment';
import { ActivatedRoute } from '@angular/router';
import { EquipmentService } from './equipment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseFormComponent } from '../base-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-equipment-info',
  standalone: false,
  templateUrl: './equipment-info.component.html',
  styleUrl: './equipment-info.component.scss'
})
export class EquipmentInfoComponent extends BaseFormComponent implements OnInit {
  equipment!:Equipment;
  title?:string;
  equipmentForm!:FormGroup;
  equipmentID!:string;
  isEditMode:boolean = false;

  constructor(
      private activedRoute:ActivatedRoute, private equipmentservice:EquipmentService,
      private fb:FormBuilder,private snackBar: MatSnackBar
    )
    {
      super()
    }

    ngOnInit(): void {
      this.form = this.fb.group({
        name: ['',
          Validators.required
        ],
        max_Hp:['', [
          Validators.required,Validators.pattern(/^[0-9]{1,9}$/)
        ]],
        max_SP:['', [
          Validators.required,Validators.pattern(/^[0-9]{1,9}$/)
        ]],
        physical_Atk:['', [
          Validators.required,Validators.pattern(/^[0-9]{1,9}$/)
        ]],
        elemental_Atk:['', [
          Validators.required,Validators.pattern(/^[0-9]{1,9}$/)
        ]],
        physical_Def:['', [
          Validators.required,Validators.pattern(/^[0-9]{1,9}$/)
        ]],
        elemental_Def:['', [
          Validators.required,Validators.pattern(/^[0-9]{1,9}$/)
        ]],
        accuracy:['', [
          Validators.required,Validators.pattern(/^[0-9]{1,9}$/)
        ]],
        speed:['', [
          Validators.required,Validators.pattern(/^[0-9]{1,9}$/)
        ]],
        critical:['', [
          Validators.required,Validators.pattern(/^[0-9]{1,9}$/)
        ]],
        evasion:['', [
          Validators.required,Validators.pattern(/^[0-9]{1,9}$/)
        ]],
        effect: ['', [Validators.required, Validators.pattern(/.*[a-zA-Z0-9]+.*/)
        ]],

        buy_Price:['', [
          Validators.required,Validators.pattern(/^[0-9]{1,9}$/)
        ]],
        sell_Price:
        ['', [
          Validators.required,Validators.pattern(/^[0-9]{1,9}$/)
        ]],
        equipment_Type:['', [
          Validators.required,
          Validators.pattern(/^(?=.*[a-zA-Z0-9].*[a-zA-Z0-9])[a-zA-Z0-9\s.,!?'"()-]{1,}$/)
        ]]
      });
      this.loadData();
    }

    loadData():void{
      let idParam = this.activedRoute.snapshot.paramMap.get("name");
      this.equipmentID = idParam ?? '';

      this.equipmentservice.getDataID(this.equipmentID).subscribe(equipment =>{
        this.equipment = equipment;
        this.isEditMode ? this.initializeForm(equipment,true) 
        : this.initializeForm(equipment,false);
    });
  }
  initializeForm(equipment: Equipment, editMode: boolean){
    this.equipment = equipment;
    this.title = (editMode ? "Edit" : "View") + " - " + equipment.name;
    this.setFormValues(equipment);
    editMode ? this.form.enable() : this.form.disable();
  }

  private setFormValues(equipment: Equipment): void {
    this.form.patchValue({
      name: equipment.name,
      max_Hp: equipment.max_Hp,
      max_SP: equipment.max_SP,
      physical_Atk: equipment.physical_Atk,
      elemental_Atk: equipment.elemental_Atk,
      physical_Def: equipment.physical_Def,
      elemental_Def: equipment.elemental_Def,
      accuracy: equipment.accuracy,
      speed: equipment.speed,
      critical: equipment.critical,
      evasion: equipment.evasion,
      effect: equipment.effect,
      buy_Price: equipment.buy_Price,
      sell_Price: equipment.sell_Price,
      equipment_Type: equipment.equipment_Type
    });
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
        this.title = "View - " + this.equipment.name;
      }, 100);
    } else {
      this.isEditMode = true;
      this.title = "Edit - " + this.equipment.name;
    }
    this.isEditMode ? this.form.enable() : this.form.disable();
  }

  onCancel():void{
    this.isEditMode = false;
    this.loadData();
  }

  onSubmit(): void {
      if (this.form.valid) {
        const updatedItem: Equipment = { ...this.equipment, ...this.form.value };
    
        this.equipmentservice.putData(updatedItem).subscribe({
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
