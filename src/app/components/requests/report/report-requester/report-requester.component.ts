import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-report-requester',
  templateUrl: './report-requester.component.html',
  styleUrls: ['./report-requester.component.css']
})
export class ReportRequesterComponent implements OnInit {
  constructor(private authService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
        .subscribe((data: { subtitle: string }) => {
          this.authService.setReportTitle(data.subtitle);
        });
  }

}
