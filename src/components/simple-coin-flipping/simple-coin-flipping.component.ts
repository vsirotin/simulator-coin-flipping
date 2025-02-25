import { Component } from '@angular/core';
import { ExplanationComponent } from './explanation/explanation.component';
import { ParameterComponent } from './parameter/parameter.component';
import { ProgressComponent } from './progress/progress.component';
import { ReportComponent } from './report/report.component';

@Component({
  selector: 'app-simple-coin-flipping',
  templateUrl: './simple-coin-flipping.component.html',
  styleUrls: ['./simple-coin-flipping.component.scss'],
  standalone: true,
  imports: [
    ExplanationComponent,
    ParameterComponent,
    ProgressComponent,
    ReportComponent
  ]
})
export class SimpleCoinFlippingComponent {}