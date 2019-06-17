import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { RequestComment, RequestDetail } from '../../../classes/request';
import { RequestService } from '../../../services/request.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { AddCommentDialog } from '../../../components/modals/dialog-addcomment/dialog-addcomment';
import { NotificationDialog } from '../../../components/modals/dialog-notification/dialog-notification';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
   request_id:number;
   role_id:number;
   status_id:number;
   comments:RequestComment[];
   hide:boolean = false;
   sidetabs:any;
   canEdit:boolean;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private requestService: RequestService,
   private authService: AuthenticationService,
   public dialog: MatDialog) {}

  ngOnInit() {
    this.canEdit = this.route.snapshot.queryParams["canEdit"] == "true";
    this.request_id = +this.route.parent.snapshot.paramMap.get('requestId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');
    this.getRequestComments();
    this.route.parent.data.subscribe((data: { requestDetail: RequestDetail }) => {
          this.status_id = data.requestDetail.generalInfo.status_id;
          this.setLayout();
        });
    this.authService.sidetabData.subscribe(data => { this.sidetabs = data; });
  }

  getRequestComments(){
    this.requestService.getRequestComments(this.request_id).subscribe(result => {
      if(result)
       this.comments = result;
    });
  }

  setLayout(){
    if(this.status_id == 4 || !this.canEdit){
      this.hide = true;
    }
  }

  openNewCommentDialog() {
    const dialogRef = this.dialog.open(AddCommentDialog, {width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let new_comment = new RequestComment();
        new_comment.comment_text = result;
        new_comment.request_id = this.request_id;
        this.requestService.addRequestComment(new_comment).subscribe(result => {
        if(result.length >= 0){
          this.comments = result;
          this.updateSideTabCount('increase');
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }

  updateSideTabCount(action:string){
    if(action == "increase")
      this.sidetabs.find(item => item.sidetab_id == 2).sidetab_count++;
  }

}
