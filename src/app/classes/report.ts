import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class ReportData{
  Category:string;
  Code:string;
  Requester:string;
  Reviewer:string;
  No_Of_Requests:number;
  Min_Days:number;
  Max_Days:number;
  Avg_Days:number;
}

export class ReportFilter{
  start_date:Date;
  end_date:Date;
  cat_id:number;
  requestor_id:number;
  reviewer_id:number;
  requestor_name:string;
  reviewer_name:string;
  category_code:string;
  create_date_start:NgbDateStruct;
  create_date_end:NgbDateStruct;
}
