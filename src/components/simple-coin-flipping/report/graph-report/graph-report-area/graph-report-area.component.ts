import { Component, OnInit } from '@angular/core';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { LoggerFactory } from '@vsirotin/log4ts';

@Component({
  selector: 'app-graph-report-area',
  standalone: true,
  imports: [GoogleChartsModule],
  templateUrl: './graph-report-area.component.html',
  styleUrl: './graph-report-area.component.scss'
})
export class GraphReportAreaComponent {

  logger = LoggerFactory.getLogger('GraphReportAreaComponent');

    typeAreaChart: ChartType = ChartType.AreaChart;
  
    dataAreaChart = [
            [1, 8.4,         7.9],
            [2,    6.9,         6.5],
            [3,        6.5,         6.4],
            [4,      -4.4,         6.2]
    ];
  
    optionsAreaChart = { title: 'Accumulated revenue time line',
      vAxis: {title: 'Accumulated Rating'},
      isStacked: true,
      series: {
        0:{color: 'blue', labelInLegend: "Revenue B"},
        1:{color: 'red', labelInLegend: "Revenue A"}

      }
    };

}
