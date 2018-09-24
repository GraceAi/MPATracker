import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { NewRequestDialog } from '../../../components/modals/dialog-newrequest/dialog-newrequest';
import { ReturnedRequest } from '../../../classes/returnedrequest';
import { RequestService } from '../../../services/request.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { NotificationDialog } from '../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-requester-request',
  templateUrl: './requester-request.component.html',
  styleUrls: ['./requester-request.component.css']
})
export class RequesterRequestComponent implements OnInit {
    searchCriteria: string;
    role_id:number = 1;
    resultCount:string;
    constructor(private router: Router,
                private route: ActivatedRoute,
                private requestService: RequestService,
                private authService:AuthenticationService,
                public dialog: MatDialog) { }

    ngOnInit() {
      this.route.data
          .subscribe((data: { title: string }) => {
            this.authService.setTitle(data.title);
          });
    }

    searchRequesterRequest(criteria:ReturnedRequest) {
        this.searchCriteria = JSON.stringify(criteria);
    }

    searchResultCount(count:number) {
      if(count > 1)
        this.resultCount = count + " results";
      else if(count <= 1)
        this.resultCount = count + " result";
    }

    openNewRequestDialog() {
      const dialogRef = this.dialog.open(NewRequestDialog, { data: {categories: this.authService.categories }, width: '635px'});

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.requestService.createNewRequest(result).subscribe(request => {
            if(result.ok == false){
              const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
            }
            else if(request != null){
              this.router.navigate(['/request/' + request.request_id + '/role/' + this.role_id]);
            }
          });
        }
      });
    }
}
