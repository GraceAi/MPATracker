import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSort, MatTableDataSource} from '@angular/material';
import { filter } from 'rxjs/operators';

import { AuthenticationService } from '../../../../../services/authentication.service';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css']
})
export class ReportTableComponent implements OnInit, OnDestroy {
  displayedColumns: string[];
  reportDataSource:any;
  private subscription_column:any;
  private subscription_data:any;

  @ViewChild(MatSort) sort: MatSort;
  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.subscription_column = this.authService.reportColumn
    .pipe(filter((val) => val!== null))
    .subscribe(columns => {
      this.displayedColumns = columns;
    });
    this.subscription_data = this.authService.reportData
    //.pipe(filter((data) => data!== null))
    .subscribe(data => {
      this.reportDataSource = new MatTableDataSource(data);
      this.reportDataSource.sort = this.sort;
    });
  }

  ngOnDestroy() {
    this.subscription_column.unsubscribe();
    this.subscription_data.unsubscribe();
  }

}
