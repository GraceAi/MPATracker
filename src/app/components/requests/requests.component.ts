import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { Tab } from '../../classes/domain';
import { AuthenticationService } from '../../services/authentication.service';
import { NotificationDialog } from '../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  tabs: Tab[] = [];
  selectedTab:any;
  constructor(private authService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog) { }
  ngOnInit() {
    this.route.data
        .subscribe((data: { tabs: Tab[] }) => {
          if(data.tabs.length > 0){
            this.tabs = data.tabs;
            //let max_tabid = Math.max.apply(Math, this.tabs.map(function(o) { return o.tab_id; }));
            //this.selectedTab = this.tabs.find(item => +(item.tab_id) == max_tabid);
            let tab_index = 0;
            let index = 0;
            if(this.router.url.includes("tab")){
              tab_index = +this.router.url.slice(-1);
              index = this.tabs.map(function(e) { return +e.tab_id; }).indexOf(tab_index);
            }
            else {
              this.router.navigate(['/home/tab/' + this.tabs[index].tab_id]);
            }
            this.selectedTab = this.tabs[index];
          }
        });
  }
}
