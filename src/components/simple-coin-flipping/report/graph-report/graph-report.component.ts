import { Component, OnInit } from '@angular/core';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { NotifierService } from '../../../../services/progress-notifier';
import { CoinFiippingGameSerieOutput } from '../../../../classes/coin-flipping-game/coin-flipping-game-serie';
import { LoggerFactory } from '@vsirotin/log4ts';
import { GraphReportPieComponent } from "./graph-report-pie/graph-report-pie.component";
import { GraphReportAreaComponent } from "./graph-report-area/graph-report-area.component";
import { GraphReportColumnComponent} from "./graph-report-column/graph-report-column.component";

@Component({
    selector: 'app-graph-report',
    imports: [
        GoogleChartsModule,
        GraphReportPieComponent,
        GraphReportAreaComponent,
        GraphReportColumnComponent
    ],
    templateUrl: './graph-report.component.html',
    styleUrls: ['./graph-report.component.scss']
})
export class GraphReportComponent implements OnInit {
  logger = LoggerFactory.getLogger('GraphReportComponent');


 



  constructor() {
    this.logger.log('GraphReportComponent created');
  }

  ngOnInit() {
    NotifierService.getStateObservable().subscribe(state => {
      this.updateChartData(state);
    });
  }

  updateChartData(state: CoinFiippingGameSerieOutput) {


  }
}
