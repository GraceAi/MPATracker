import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Role, User } from '../../../../classes/domain';
import { RequestService } from '../../../../services/request.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { NotificationDialog } from '../../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.css']
})
export class AdminRolesComponent implements OnInit {
  displayedColumns: string[] = ['user'];
  assignedUserDataSource:any;
  availableUserDataSource:any;
  roles:Role[];
  selectedRole:Role;
  assignedUsers:User[];
  filteredUsers:User[];
  selectedAssignedUser:any;
  selectedAvailableUser:any;
  //@ViewChild(MatSort) sort: MatSort;
  constructor(
   private requestService: RequestService,
   private authService: AuthenticationService,
   public dialog: MatDialog) { }

  ngOnInit() {
    this.roles = this.authService.allRoles;
    this.selectedRole = new Role();
    this.selectedRole.role_name = "select...";
    this.availableUserDataSource = new MatTableDataSource(this.authService.allUsers);
  }

  applyAssignedFilter(filterValue: string) {
    if(this.assignedUserDataSource != null)
      this.assignedUserDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(filterValue: string) {
    if(this.availableUserDataSource != null)
      this.availableUserDataSource.filter = filterValue.trim().toLowerCase();
  }

  onSelectAssignedUser(row:any){
    this.selectedAssignedUser = row;
  }

  onSelectAvailableUser(row:any){
    this.selectedAvailableUser = row;
  }

  addAssignedUser(){
    if(this.selectedAvailableUser){
      this.assignedUsers.push(this.selectedAvailableUser);
      this.assignedUserDataSource = new MatTableDataSource(this.assignedUsers);
      //this.assignedUserDataSource.sort = this.sort;
      this.filteredUsers = this.filteredUsers.filter(item => item.user_id != this.selectedAvailableUser.user_id);
      this.availableUserDataSource = new MatTableDataSource(this.filteredUsers);
      //this.availableUserDataSource.sort = this.sort;
      this.selectedAvailableUser = null;
    }

  }

  removeAssignedUser(){
    if(this.selectedAssignedUser){
      this.assignedUsers = this.assignedUsers.filter(f => f.user_id != this.selectedAssignedUser.user_id);
      this.assignedUserDataSource = new MatTableDataSource(this.assignedUsers);
      //this.assignedUserDataSource.sort = this.sort;
      this.filteredUsers.push(this.selectedAssignedUser);
      this.availableUserDataSource = new MatTableDataSource(this.filteredUsers);
      //this.availableUserDataSource.sort = this.sort;

      this.selectedAssignedUser = null;
    }
  }

  onChangeRole(role:any){
    this.selectedRole = role;
    this.getAssignedUsersByRoleId(role.role_id);
  }

  getAssignedUsersByRoleId(role_id:number){
    this.requestService.getAssignedUsersByRoleId(role_id).subscribe(result => {
      this.filteredUsers = this.authService.allUsers;
      if(result.length > 0){
        this.filteredUsers = this.authService.allUsers.filter(function(obj) {
            return !result.some(function(obj2) {
                return obj.user_id == obj2.user_id;
            });
        });
      }
      this.assignedUsers = result;
      this.assignedUserDataSource = new MatTableDataSource(result);
      this.availableUserDataSource = new MatTableDataSource(this.filteredUsers);
      //this.assignedUserDataSource.sort = this.sort;
      //this.availableUserDataSource.sort = this.sort;
    });
  }

  assignUsersByRoleId(){
    this.requestService.assignUsersByRoleId(this.selectedRole.role_id, this.assignedUsers).subscribe(result => {
      if(result == "Success"){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Role Assign is successful." , width: '600px'});
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

  cancelAssign(){
    //location.reload();
  }

}
