import { Component, OnInit } from '@angular/core';
import { LoggerFactory } from '@vsirotin/log4ts';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { NotifierService } from '../../../../../services/progress-notifier';
import { CoinFiippingGameSerieOutput } from '../../../../../classes/coin-flipping-game/coin-flipping-game-serie';

@Component({
  selector: 'app-graph-report-pie',
  standalone: true,
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
    colors: ['red', 'blue', 'gray'], is3D: true
  };

 ngOnInit() {
    NotifierService.getStateObservable().subscribe(state => {
      this.updateChartData(state);
    });
  }
 
  updateChartData(state: CoinFiippingGameSerieOutput) {
    this.logger.debug('updateChartData state:', state);

    const allStepsSet = new Set<number>([
      ...state.gamesWithWinnerA.keys(),
      ...state.gamesWithWinnerB.keys(),
      ...state.gamesWithDraw.keys()
    ]);

    const allSteps = Array.from(allStepsSet).sort((a, b) => a - b);

    this.logger.debug('allSteps:', allSteps);

    this.dataPieChart =[
      ['Win A', 12],
      ['Win B', 26.8],
      ['Draw', 12.8]
    ];
  }

}
