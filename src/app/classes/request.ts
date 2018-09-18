export class RequestDetail{
  sideTabs:any;
  generalInfo:any;

}

export class Request {
  request_id: number;
  sequence_id: string;
  create_date:string;
  description:string;
  requestor_id:string;
  department_id:number;
  category_id:number;
  status_id:number;
  complete_date:string;
  notes:string;
  high_priority:boolean;
}
export class RequestGeneral {
  request_id: number;
  sequence_id:string;
  create_date:string;
  category_id:number;
  category_code:string;
  status_id:number;
  status_desc:string;
  description:string;
  complete_date:string;
  requestor_id:number;
  requestor_name:string;
  high_priority:boolean;
  is_overdue:boolean;
  notes:string;
  location_id:number;
  location_name:string;
  str_reviewers:string;
  deptmt_id:number;
  deptmt_name:string;
}
export class RequestContact{
  contact_id: number;
  first_name: string;
  last_name: string;
  company:string;
  email:string;
  phone:string;
  request_id:number;
}
export class RequestComment{
  comment_id:number;
  comment_date:string;
  user_id:number;
  request_id:number;
  user_name:string;
  comment_text:string;
}
export class RequestPwLink{
  link_id:number;
  link_name:string;
  link_desc:string;
  request_id:number;
}
export class RequestDocument{
  document_id:number;
  upload_date:string;
  description:string;
  name:string;
  user_id:number;
  user_name:string;
  request_id:number;
  document_link:string;
}
export class RequestContract{
  contract_no:string;
  request_id:number;
}

export class RequestLocation{
  name:string;
  description:string;
  request_id:number;
  shape:string;
}
