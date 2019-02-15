export class Project{
  project_id:number;
  project_number:string;
  contract_number: string;
  firm_id: number;
  firm_name: string;
  description: string;
  admin_id: number;
  admin_name: string;
  contact_id: number;
  contact_name: string;
  str_managers: string;
}

export class Permit{
  permit_id: number;
  project_id: number;
  corps_permit_required:boolean;
  corps_permit_status:string;
  mde_permit_required:boolean;
  mde_permit_status:string;
  dam_saftey_approval:boolean;
  dam_saftey_status:string;
  swm_approval:boolean;
  swm_status:string;
  ms4_permit_required:boolean;
  ms4_permit_status:string;
  local_permit_required:boolean;
  local_permit_status:string;
  wetland_permit_required:boolean;
  wetland_permit_status:string;
  critical_area_permit_required:boolean;
  critical_area_permit_status:string;
}

export class ProcurementPhase{
  procurement_phase_id:number;
  project_id:number;
  officer_id:number;
  officer_name:string;
  current_proc_day:number;
  next_or_final_specs_date:string;
  procurement_start_date:string;
  prg_date:string;
  early_adv_date:string;
  early_bids_date:string;
  mpc:string;
  bpw:string;
  proc_ntp_date:string;
  proc_comp_date:string;
}

export class ConstructionPhase{
  construction_phase_id:number;
  firm_id:number;
  firm_name:string;
  project_id:number;
  cons_ntp_date:string;
  project_size_id:number;
  size_name:string;
  days:number;
  milestones: ConstructionMilestone[];
}

export class ConstructionMilestone{
  construction_phase_id:number;
  milestone_id:number;
  milestone_percentage:number;
  target_date:string;
  complete_date:string;
  comment_text:string;
  commenter_id:number;
  //comment_date:string;
}

export class ProjectReportFilter{
  start_date:string;
  end_date:string;
}

export class ProjectReport{
  project_id: number;
  project_number:string;
  max_date:string;
  min_date:string;
  //dates:ProjectDate[];
  procurement_dates:ProjectDate[];
  construction_dates:ProjectDate[];
}

export class ProjectDate{
  display_date: string;
  display_name:string;
  full_name:string;
}
