import { Component, OnInit } from '@angular/core';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { LoggerFactory } from '@vsirotin/log4ts';
import { NotifierService } from '../../../../../services/progress-notifier';
import { CoinFiippingGameSerieOutput } from '../../../../../classes/coin-flipping-game/coin-flipping-game-serie';

@Component({
    selector: 'app-graph-report-column',
    imports: [GoogleChartsModule],
    templateUrl: './graph-report-column.component.html',
    styleUrl: './graph-report-column.component.scss'
})
export class GraphReportColumnComponent {
  logger = LoggerFactory.getLogger('GraphReportColumnComponent');

  type: ChartType = ChartType.BarChart;

  data: any[]  = [];

  columnNames = ['steps', 'Wins A', 'Wins B'];

  

  chartOptions = {
    title: 'Games Results',
    hAxis: {
      title: 'Number of wins by step'
    },
    vAxis: {
      title: 'Number of steps up to win'
    },
    legend: { position: 'top' },

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
      this.data = new Array<any>();
      allSteps.forEach(step => {
        const line = [
          "" + step,
          state.gamesWithWinnerA.get(step) || 0,
          state.gamesWithWinnerB.get(step) || 0,
        ];
        this.data.push(line);
        
      });
      this.logger.debug('data:', this.data);
  
    }

}
