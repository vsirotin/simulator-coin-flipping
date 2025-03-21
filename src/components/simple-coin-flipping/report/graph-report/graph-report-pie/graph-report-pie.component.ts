import { Component } from '@angular/core';
import { LoggerFactory } from '@vsirotin/log4ts';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { NotifierService } from '../../../../../services/progress-notifier';
import { CoinFiippingGameSerieOutput } from '../../../../../classes/coin-flipping-game/coin-flipping-game-serie';

@Component({
    selector: 'app-graph-report-pie',
    imports: [GoogleChartsModule],
    templateUrl: './graph-report-pie.component.html',
    styleUrl: './graph-report-pie.component.scss'
})
export class GraphReportPieComponent {
  logger = LoggerFactory.getLogger('GraphReportPieComponent');

  typePieChart: ChartType = ChartType.PieChart;

  winsA = 0;
  winsB = 0;
  draws = 0;

  dataPieChart : any[] = [];

  optionsPieChart = {
    title: 'Distribution of wins of the participants',
    colors: ['blue', 'red', 'gray'], is3D: true
  };

 ngOnInit() {
    NotifierService.getStateObservable().subscribe(state => {
      this.updateChartData(state);
    });
  }
 
  updateChartData(state: CoinFiippingGameSerieOutput) {
    this.logger.debug('updateChartData state:', state);

    const winsA = Array.from(state.gamesWithWinnerA.values()).reduce((sum, value) => sum + value, 0);
    const winsB = Array.from(state.gamesWithWinnerB.values()).reduce((sum, value) => sum + value, 0);
    const winsDraw = Array.from(state.gamesWithDraw.values()).reduce((sum, value) => sum + value, 0);

    
    this.logger.debug('in updateChartData winsA: ', winsA, " winsB: ", winsB, " winsDraw: ", winsDraw);

    this.dataPieChart =[
      ['Win A', winsA],
      ['Win B', winsB],
      ['Draw', winsDraw]
    ];

    
  }

}
