import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-report-response-category',
  templateUrl: './report-response-category.component.html',
  styleUrls: ['./report-response-category.component.css']
})
export class ReportResponseCategoryComponent implements OnInit {
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
