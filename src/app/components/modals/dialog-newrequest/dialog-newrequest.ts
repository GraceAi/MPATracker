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
  archive_link:string;
  constructor(
    public dialogRef: MatDialogRef<NewRequestDialog>,
     @Inject(MAT_DIALOG_DATA) data
    ) {
      this.selectedCategory = new Category();
      this.selectedCategory.category_name = "Select...";
      this.categories = data.categories;
      this.archive_link = data.archive_link;
    }

    onChangeCategory(category:Category){
      this.selectedCategory = category;
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

}
