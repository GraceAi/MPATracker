export class EnvironmentSetting{
  service_url:string;
  pt_feature_layer:string;
  poly_feature_layer:string;
  base_layer:string;
}

export class Tab {
  tab_id: number;
  tab_name: string;
  tab_desc:string;
}
export class SideTab {
  sidetab_id: number;
  sidetab_name: string;
  category_id:number;
  sidetab_count:number;
}
export class Status {
  status_id: number;
  status_desc: string;
}

export class Department {
  deptmt_id: number;
  deptmt_name: string;
  deptmt_visibility:string;
}

export class Category {
  category_id: number;
  category_name: string;
  max_request_days: number;
  category_code: string;
}

export class Contact {
  contact_id: number;
  contact_details: string;
}

export class Role {
  role_id: number;
  role_name: string;
}

export class User{
  user_id:number;
  fname:string;
  lname:string;
  email:string;
  login:string;
}

export class Location{
  location_id:number;
  location_name:string;
}

export class Firm{
  firm_id:number;
  firm_name:string;
  firm_phone:number;
  firm_email:string;
}

export class ProjectSize{
  size_id:number;
  size_name:string;
  days:number;
}

export class Milestone{
  milestone_id:number;
  percentage:number;
}
