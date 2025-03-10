import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoinFiippingGameSerieOutput, CoinFlippingExperimentSerie, CoinFlippingGameSerieInput } from '../../../classes/coin-flipping-game/coin-flipping-game-serie';
import { CoinFlippingGameInput } from '../../../classes/coin-flipping-game/coin-flipping-game';
import { LoggerFactory } from '@vsirotin/log4ts';
import { NotifierService } from '../../../services/progress-notifier';

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
  experimentSerie: CoinFlippingExperimentSerie | null = null;

  logger = LoggerFactory.getLogger('ParameterComponent');
  
  constructor(private fb: FormBuilder) {
    this.parameterForm = this.fb.group({
      betA: [3, [Validators.required, Validators.min(1), Validators.max(1000)]],
      betB: [3, [Validators.required, Validators.min(1), Validators.max(1000)]],
      limitA: [3, [Validators.required, Validators.min(1), Validators.max(1000)]],
      limitB: [3, [Validators.required, Validators.min(1), Validators.max(1000)]],
      maxGameLength: [10, [Validators.required, Validators.min(1), Validators.max(1000000)]],
      numberOfGames: [10, [Validators.required, Validators.min(1), Validators.max(1000000)]],
      progressReportFrequency: [1, [Validators.required, Validators.min(1), Validators.max(1000000)]]
    });
    // Bind the reportProgress method to the instance
    this.reportProgress = this.reportProgress.bind(this);
    this.logger.log('ParameterComponent created');
  }

  async startSimulation() {
    if (this.parameterForm.valid) {
      this.isSimulationRunning = true;
      const gameInput = new CoinFlippingGameInput(
        this.parameterForm.value.betA,
        this.parameterForm.value.betB,
        this.parameterForm.value.maxGameLength
      );

      const serieInput = new CoinFlippingGameSerieInput(
        this.parameterForm.value.numberOfGames,
        gameInput
      );

      this.experimentSerie = new CoinFlippingExperimentSerie(serieInput);
      const result = await this.experimentSerie.runExperimentSerie(
        this.parameterForm.value.progressReportFrequency, this.reportProgress);

      this.isSimulationRunning = false; 
      NotifierService.notifyProgress(100); 
    }
  }

  stopSimulation() {
    this.isSimulationRunning = false;
    this.experimentSerie?.stopExperimentSerie();
    this.logger.log('Simulation stopped');
  }

  reportProgress (state: CoinFiippingGameSerieOutput): void {
    let experimentProgress = this.experimentSerie?.getCurrentExperimentProgress() || 0;
    this.logger.log('Progress:', experimentProgress);
    NotifierService.notifyProgress(experimentProgress * 100);
    NotifierService.notifyState(state);
  }
}