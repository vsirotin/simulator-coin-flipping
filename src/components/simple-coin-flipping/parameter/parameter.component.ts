import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class ParameterComponent {
  parameterForm: FormGroup;
  isSimulationRunning = false;

  constructor(private fb: FormBuilder) {
    this.parameterForm = this.fb.group({
      betA: [3, [Validators.required, Validators.min(1), Validators.max(1000)]],
      betB: [3, [Validators.required, Validators.min(1), Validators.max(1000)]],
      maxGameLength: [1000, [Validators.required, Validators.min(1), Validators.max(1000000)]],
      numberOfGames: [100, [Validators.required, Validators.min(1), Validators.max(1000000)]]
    });
  }

  startSimulation() {
    if (this.parameterForm.valid) {
      this.isSimulationRunning = true;
      // Placeholder for starting the simulation process
      console.log('Simulation started with parameters:', this.parameterForm.value);
    }
  }

  stopSimulation() {
    this.isSimulationRunning = false;
    // Placeholder for stopping the simulation process
    console.log('Simulation stopped');
  }
}