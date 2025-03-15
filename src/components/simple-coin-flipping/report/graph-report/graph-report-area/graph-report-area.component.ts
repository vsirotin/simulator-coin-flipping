import { Component } from '@angular/core';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { LoggerFactory } from '@vsirotin/log4ts';
import { NotifierService } from '../../../../../services/progress-notifier';
import { CoinFiippingGameSerieOutput } from '../../../../../classes/coin-flipping-game/coin-flipping-game-serie';

@Component({
    selector: 'app-graph-report-area',
    imports: [GoogleChartsModule],
    templateUrl: './graph-report-area.component.html',
    styleUrl: './graph-report-area.component.scss'
})
export class GraphReportAreaComponent {

  logger = LoggerFactory.getLogger('GraphReportAreaComponent');

    typeAreaChart: ChartType = ChartType.AreaChart;
    dataAreaChart: any[] = [];
  
    optionsAreaChart = { title: 'Wallet Dynamic',
      vAxis: {title: 'Wallet balance'},
      hAxis: {title: 'Gaminig run'},
      isStacked: true,
      series: {
        0:{color: 'blue', labelInLegend: "Wallet A"},
        1:{color: 'red', labelInLegend: "Wallet B"}

      }
    };

    ngOnInit() {
        NotifierService.getStateObservable().subscribe(state => {
          this.updateChartData(state);
        });
      }
      
    updateChartData(state: CoinFiippingGameSerieOutput) {
      this.logger.debug('updateChartData state:', state);
  
      const n = state.walletA.length;

      const newData = new Array<any>();

      for (let i = 0; i < n; i++) {
        newData.push([i, state.walletA[i], state.walletB[i]]);
      }

      this.dataAreaChart = newData;

      this.logger.debug('data:', this.dataAreaChart);
    }
}
