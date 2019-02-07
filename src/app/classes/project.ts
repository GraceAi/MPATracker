import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

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
  corps_permit_date:NgbDateStruct;
  mde_permit_required:boolean;
  mde_permit_status:string;
  mde_permit_date:NgbDateStruct;
  dam_saftey_approval:boolean;
  dam_saftey_status:string;
  dam_saftey_date:NgbDateStruct;
  swm_approval:boolean;
  swm_status:string;
  swm_date:NgbDateStruct;
  ms4_permit_required:boolean;
  ms4_permit_status:string;
  ms4_permit_date:NgbDateStruct;
  local_permit_required:boolean;
  local_permit_status:string;
  local_permit_date:NgbDateStruct;
  wetland_permit_required:boolean;
  wetland_permit_status:string;
  wetland_permit_date:NgbDateStruct;
  critical_area_permit_required:boolean;
  critical_area_permit_status:string;
  critical_area_date:NgbDateStruct;
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
  ntp_date:string;
  compl_date:string;
}

export class ConstructionPhase{
  construction_phase_id:number;
  firm_id:number;
  firm_name:string;
  project_id:number;
  ntp_date:string;
  ntp_formatted:NgbDateStruct;
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
  target_formatted:NgbDateStruct;
  complete_date:string;
  complete_formatted:NgbDateStruct;
  comment_text:string;
  commenter_id:number;
  comment_date:string;
}
