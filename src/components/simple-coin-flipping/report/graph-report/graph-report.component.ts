import { Component, OnInit } from '@angular/core';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { NotifierService } from '../../../../services/progress-notifier';
import { CoinFiippingGameSerieOutput } from '../../../../classes/coin-flipping-game/coin-flipping-game-serie';
import { LoggerFactory } from '@vsirotin/log4ts';



@Component({
  selector: 'app-graph-report',
  standalone: true,
  imports: [GoogleChartsModule],
  templateUrl: './graph-report.component.html',
  styleUrls: ['./graph-report.component.scss']

})
export class GraphReportComponent implements OnInit {
  logger = LoggerFactory.getLogger('GraphReportComponent');

  gamesWithWinnerAData: any[] = [];
  gamesWithWinnerBData: any[] = [];

  type: ChartType = ChartType.BarChart;

  data: any[]  = [];

  columnNames = ['steps', 'Wins A', 'Wins B'];

  title1 = 'Games Results';
  type1: ChartType = ChartType.PieChart;
  data1 =[
    ['Win A', 12],
    ['Win B', 26.8],
    ['Draw', 12.8]
 ];

  
  options1 = {
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'], is3D: true
 };

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

  chartOptions1 = {
    chart: {
      title: 'Company Performance',
      subtitle: 'Sales, Expenses, and Profit: 2014-2017',
    }
  };
  constructor() {
    this.logger.log('GraphReportComponent created');
  }

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
