import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class ReturnedRequest {
  request_id: number;
  sequence_id: string;
  create_date:string;
  description:string;
  requestor_id:number;
  requestor_name:string;
  deptmt_id:number;
  deptmt_name:string;
  reviewer_name:string;
  str_reviewers:string;
  category_code:string;
  category_id:number;
  status_id:number;
  status_desc:string;
  complete_date:string;
  notes:string;
  high_priority:boolean;
  location_id:number;
  location_name:string;
  Contracts:string[]
  create_date_start:NgbDateStruct;
  create_date_end:NgbDateStruct;
  //complete_date_start:NgbDateStruct;
  //complete_date_end:NgbDateStruct;
  contract_no:string;
}
