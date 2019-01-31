import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject} from 'rxjs';

import { switchMap } from 'rxjs/operators';

import { AuthenticationService } from '../../../services/authentication.service';
import { ReportData } from '../../../classes/report';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, AfterViewChecked {
  subtitle:string ="";
  filter:any;
  constructor(private authService: AuthenticationService,
              private requestService: RequestService,
              private router: Router,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(){
    this.route.data
        .subscribe((data: { title: string }) => {
          this.authService.setTitle(data.title);
        });
    this.authService.reportFilter.subscribe(
      result => {this.filter = result}
    );
  }

  ngAfterViewChecked() {
    this.authService.reportTitle.subscribe(
      result => {this.subtitle = result}
    );
    this.cdr.detectChanges();
  }
}
