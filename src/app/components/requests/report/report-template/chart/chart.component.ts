import { Component, OnInit, OnDestroy } from '@angular/core';
import {Chart} from 'chart.js';
import { filter } from 'rxjs/operators';

import { AuthenticationService } from '../../../../../services/authentication.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  chart: any;
  private subscription:any;
  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.subscription = this.authService.chartData
    .subscribe(data => {
      if(this.chart != null){
        this.chart.destroy();
      }
      this.displayChart(data);
    });
  }

  displayChart(data:any){
    this.chart = new Chart('canvas', data);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
