import { Component,} from '@angular/core';
import { GoogleChartsModule } from 'angular-google-charts';
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
export class GraphReportComponent {

  
}
