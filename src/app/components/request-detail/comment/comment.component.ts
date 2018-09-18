import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { RequestComment } from '../../../classes/request';
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
   comments:RequestComment[];
  constructor(private router: Router,
   private route: ActivatedRoute,
   private requestService: RequestService,
   private authService: AuthenticationService,
   public dialog: MatDialog) {}

  ngOnInit() {
    this.request_id = +this.route.parent.snapshot.paramMap.get('requestId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');
    this.getRequestComments();
  }

  getRequestComments(){
    this.requestService.getRequestComments(this.request_id).subscribe(result => {
      if(result)
       this.comments = result;
    });
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
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }

}
