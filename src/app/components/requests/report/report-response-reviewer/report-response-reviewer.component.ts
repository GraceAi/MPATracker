import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-report-response-reviewer',
  templateUrl: './report-response-reviewer.component.html',
  styleUrls: ['./report-response-reviewer.component.css']
})
export class ReportResponseReviewerComponent implements OnInit {
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
