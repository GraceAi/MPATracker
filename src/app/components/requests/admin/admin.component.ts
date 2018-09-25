import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  roletab:boolean = false;
  cattab:boolean = false;
  sidetab:boolean = false;
  constructor(private authService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
        .subscribe((data: { title: string }) => {
          this.authService.setTitle(data.title);

          let lastslashindex = this.router.url.lastIndexOf('/');
          let tabname= this.router.url.substring(lastslashindex  + 1);
          if(tabname == "roles")
            this.roletab = true;
          else if(tabname == "category")
            this.cattab = true;
          else if(tabname == "sidetabs")
            this.sidetab = true;
        });
  }
  displayAdminRoleTab(){
    this.resetTab();
    this.roletab = true;
  }
  displayAdminCategoryTab(){
    this.resetTab();
    this.cattab = true;
  }
  displayAdminSideTab(){
    this.resetTab();
    this.sidetab = true;
  }
  resetTab(){
    this.roletab = false;
    this.cattab = false;
    this.sidetab = false;
  }

}
