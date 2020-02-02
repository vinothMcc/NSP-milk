import { Component, OnInit } from '@angular/core';

import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  Object;
  isLoading = false;
  constructor(private _statistic: StatisticsService) {}
  statisticsData = {};
  ngOnInit() {
    this.isLoading = true;
    this._statistic.getStatistics().subscribe(data => {
      console.log('Data : ', data);
      this.statisticsData = data;
      this.isLoading = false;
    });
  }
}
