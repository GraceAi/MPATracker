import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Category } from '../../../classes/domain';

@Component({
  selector: 'dialog-newrequest',
  templateUrl: './dialog-newrequest.html',
})
export class NewRequestDialog {
  selectedCategory: Category;
  categories:Category[];
  constructor(
    public dialogRef: MatDialogRef<NewRequestDialog>,
     @Inject(MAT_DIALOG_DATA) data
    ) {
      this.selectedCategory = new Category();
      this.selectedCategory.category_name = "select...";
      this.categories = data.categories;
    }

    onChangeCategory(category:Category){
      this.selectedCategory = category;
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

}
