import { Component } from '@angular/core';
import { ExplanationComponent } from './explanation/explanation.component';
import { ParameterComponent } from './parameter/parameter.component';

@Component({
  selector: 'app-simple-coin-flipping',
  templateUrl: './simple-coin-flipping.component.html',
  styleUrls: ['./simple-coin-flipping.component.scss'],
  standalone: true,
  imports: [
    ExplanationComponent,
    ParameterComponent
  ]
})
export class SimpleCoinFlippingComponent {}