import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Contact } from '../../../classes/domain';
import { AuthenticationService } from '../../../services/authentication.service';
import { DomainService } from '../../../services/domain.service';
import { RequestService } from '../../../services/request.service';
import { NewContactDialog } from '../../../components/modals/dialog-newcontact/dialog-newcontact';

@Component({
  selector: 'dialog-addcontact',
  templateUrl: './dialog-addcontact.html',
})
export class AddContactDialog {
  selectedContact: Contact;
  contacts:Contact[];
  constructor(
    public dialogRef: MatDialogRef<AddContactDialog>,
    private authService: AuthenticationService,
    private domainService: DomainService,
    private requestService: RequestService,
    public dialog: MatDialog
   ) {
     this.selectedContact = new Contact();
     this.selectedContact.contact_details = "select...";
     this.contacts = this.authService.contacts;
    }
    onChangeContact(contact:Contact){
      this.selectedContact = contact;
    }

    openNewContactDialog() {
      const dialogRef = this.dialog.open(NewContactDialog, {width: '600px'});
      dialogRef.afterClosed().subscribe(result => {
        if(result.email != null){
          this.requestService.newRequestContact(result).subscribe(contact => {
            if(contact.ok == false){
              console.log(contact.message);
            }
            else if(contact!= null){
              this.domainService.getContacts(this.authService.appSettings.service_url)
                  .subscribe(result => {
                    this.contacts = result;
                    this.selectedContact = result.find(x => x.contact_id === contact.contact_id);
                  });
            }
          });
        }
      });
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
