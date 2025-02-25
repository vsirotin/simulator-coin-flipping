import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoinFiippingGameSerieOutput, CoinFlippingExperimentSerie, CoinFlippingGameSerieInput } from '../../../classes/coin-flipping-game/coin-flipping-game-serie';
import { CoinFlippingGameInput } from '../../../classes/coin-flipping-game/coin-flipping-game';
import { LoggerFactory } from '@vsirotin/log4ts';

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
      maxGameLength: [10, [Validators.required, Validators.min(1), Validators.max(1000000)]],
      numberOfGames: [10, [Validators.required, Validators.min(1), Validators.max(1000000)]],
      progressReportFrequency: [10, [Validators.required, Validators.min(1), Validators.max(1000000)]]
    });
    LoggerFactory.setAllLevelsByAllLoggers();
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
    }
  }

  stopSimulation() {
    this.isSimulationRunning = false;
    this.experimentSerie?.stopExperimentSerie();
    this.logger.log('Simulation stopped');
  }

  reportProgress (state: CoinFiippingGameSerieOutput): void {
    //this.logger.log("Progress report:", state);
  }
}