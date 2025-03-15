import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { GraphReportComponent } from "./graph-report/graph-report.component";
import { TableReportComponent } from "./table-report/table-report.component"; 
import { NotifierService } from '../../../services/progress-notifier';
import { CoinFiippingGameSerieOutput } from '../../../classes/coin-flipping-game/coin-flipping-game-serie';

@Component({
    selector: 'app-report',
    imports: [MatCardModule,
        GraphReportComponent,
        TableReportComponent,
        MatExpansionModule
    ],
    templateUrl: './report.component.html',
    styleUrl: './report.component.scss'
})
export class ReportComponent {
    isResultAvailable: boolean = false;
    isExpanded: boolean = true;

    ngOnInit() {
        NotifierService.getStateObservable().subscribe(state => {
          this.updateChartData(state);
        });
      }
    
      updateChartData(state: CoinFiippingGameSerieOutput) {
        this.isResultAvailable = true;
    
      }
}
