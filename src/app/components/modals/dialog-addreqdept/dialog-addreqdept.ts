import { Component, Inject} from '@angular/core';
import {MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Department, User } from '../../../classes/domain';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'dialog-addreqdept',
  templateUrl: './dialog-addreqdept.html',
})
export class AddReqDeptDialog {
  title:string = "Add Requester Department";
  dept:Department = new Department();
  editMode:boolean = false;
  displayedColumns: string[] = ['user'];
  deptUserDataSource:any;
  availableUserDataSource:any;
  deptUsers:User[] = [];
  filteredUsers:User[] = [];
  selectedDeptUser:any;
  selectedAvailableUser:any;
  constructor(
    public dialogRef: MatDialogRef<AddReqDeptDialog>,
    private authService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      if(data){
        this.dept = data;
        this.editMode = true;
        this.title = "Edit Requester Department";
      }
      else{
        this.dept.deptmt_visibility = false;
      }
      this.getDeptUsers();
    }
    getDeptUsers(){
      this.filteredUsers = this.authService.allUsers;
      let users = this.dept.users;
      if(users != null && users.length > 0){
        this.deptUsers = users;
        this.filteredUsers = this.authService.allUsers.filter(function(obj) {
            return (obj.deptmt_id === null) && !users.some(function(obj2) {
                return obj.user_id == obj2.user_id;
            });
        });
      }
      else{
        this.filteredUsers = this.authService.allUsers.filter(function(obj) {
            return obj.deptmt_id === null;
        });
      }
      this.deptUserDataSource = new MatTableDataSource(users);
      this.availableUserDataSource = new MatTableDataSource(this.filteredUsers);
    }

    applyDeptUserFilter(filterValue: string) {
      if(this.deptUserDataSource != null)
        this.deptUserDataSource.filter = filterValue.trim().toLowerCase();
    }

    applyUserFilter(filterValue: string) {
      if(this.availableUserDataSource != null)
        this.availableUserDataSource.filter = filterValue.trim().toLowerCase();
    }

    onSelectDeptUser(row:any){
      this.selectedDeptUser = row;
    }

    onSelectAvailableUser(row:any){
      this.selectedAvailableUser = row;
    }

    addDeptUser(){
      if(this.selectedAvailableUser){
        this.deptUsers.push(this.selectedAvailableUser);
        this.deptUserDataSource = new MatTableDataSource(this.deptUsers);
        this.filteredUsers = this.filteredUsers.filter(item => item.user_id != this.selectedAvailableUser.user_id);
        this.availableUserDataSource = new MatTableDataSource(this.filteredUsers);

        this.selectedAvailableUser = null;
      }

    }

    removeDeptUser(){
      if(this.selectedDeptUser){
        this.deptUsers = this.deptUsers.filter(f => f.user_id != this.selectedDeptUser.user_id);
        this.deptUserDataSource = new MatTableDataSource(this.deptUsers);
        this.filteredUsers.push(this.selectedDeptUser);
        this.availableUserDataSource = new MatTableDataSource(this.filteredUsers);

        this.selectedDeptUser = null;
      }
    }

    save() {
      this.dept.users = this.deptUsers;
      this.dialogRef.close(this.dept);
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
