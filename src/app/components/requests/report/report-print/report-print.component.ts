import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-report-print',
  templateUrl: './report-print.component.html',
  styleUrls: ['./report-print.component.css']
})
export class ReportPrintComponent implements OnInit {
  criteria:any;
  subtitle:string;
  username:string;
  currentdate:number;
  private logoPath = "./assets/img/mpa.png";
  constructor(private authService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute) { }
  ngOnInit() {
    this.subtitle = "Report for " + this.route.snapshot.paramMap.get('title');
    //this.authService.setTitle("Report for " + this.route.snapshot.paramMap.get('title'));
    this.authService.reportFilter.subscribe(
      result => {this.criteria = result}
    );
    this.username = this.authService.username;
    this.currentdate = Date.now();
  }
  printReport(){
    window.print();
  }

}
