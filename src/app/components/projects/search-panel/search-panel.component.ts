import { Component, OnInit, OnDestroy } from '@angular/core';

import { Project } from '../../../classes/project';
import { Firm } from '../../../classes/domain';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector: 'project-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})
export class ProjectSearchPanelComponent implements OnInit, OnDestroy  {
  searchCriteria = new Project();
  firms:Firm[];
  selectedFirm:string = "All";
  constructor(
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.firms = this.authService.firms;
  }

  onChangeFirm(firm:Firm){
    if(firm == null){
      this.selectedFirm = "All";
      this.searchCriteria.firm_id = null;
      //this.searchCriteria.firm_name = null;
    }
    else {
      this.selectedFirm = firm.firm_name;
      this.searchCriteria.firm_id = firm.firm_id;
      //this.searchCriteria.firm_name = firm.firm_name;
    }
  }
  searchProjects(){
    this.authService.setProjectFilter(this.searchCriteria);
  }
  resetSearch(){
    this.searchCriteria = new Project();
    this.selectedFirm = "All";
    this.authService.setProjectFilter(this.searchCriteria);
  }
  ngOnDestroy() {
    //this.searchCriteria = new Project();
    //this.authService.setProjectFilter(this.searchCriteria);
  }

}
