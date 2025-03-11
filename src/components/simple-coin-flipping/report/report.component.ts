import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GraphReportComponent } from "./graph-report/graph-report.component";
import { TableReportComponent } from "./table-report/table-report.component"; 

@Component({
    selector: 'app-report',
    imports: [MatCardModule,
        GraphReportComponent,
        TableReportComponent
    ],
    templateUrl: './report.component.html',
    styleUrl: './report.component.scss'
})
export class ReportComponent {

}
