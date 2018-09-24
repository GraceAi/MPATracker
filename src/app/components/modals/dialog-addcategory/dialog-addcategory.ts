import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Category } from '../../../classes/domain';

@Component({
  selector: 'dialog-addcategory',
  templateUrl: './dialog-addcategory.html',
})
export class AddCategoryDialog {
  category:Category = new Category();
  title:string = "New Category";
  editMode:boolean = false;
  currentCode:string;
  constructor(
    public dialogRef: MatDialogRef<AddCategoryDialog>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      if(data){
        this.category = data;
        this.editMode = true;
        this.title = "Edit Category";
        this.currentCode = data.category_code;
      }
    }
    save() {
      this.dialogRef.close(this.category);
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

}
