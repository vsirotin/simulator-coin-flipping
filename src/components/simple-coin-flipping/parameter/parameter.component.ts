import { Component } from '@angular/core';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoinFiippingGameSerieOutput, CoinFlippingExperimentSerie, CoinFlippingGameSerieInput } from '../../../classes/coin-flipping-game/coin-flipping-game-serie';
import { CoinFlippingGameInput } from '../../../classes/coin-flipping-game/coin-flipping-game';
import { LoggerFactory } from '@vsirotin/log4ts';
import { NotifierService } from '../../../services/progress-notifier';

@Component({
    standalone: true,
    selector: 'app-parameter',
    templateUrl: './parameter.component.html',
    styleUrls: ['./parameter.component.scss'],
    imports: [
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class ParameterComponent {
  parameterForm: FormGroup;
  isSimulationRunning = false;
  experimentSerie: CoinFlippingExperimentSerie | null = null;

  logger = LoggerFactory.getLogger('ParameterComponent');
  
  constructor(private fb: FormBuilder) {
    this.parameterForm = this.fb.group({
      betA: [10, [Validators.required, Validators.min(1), Validators.max(1000)]],
      betB: [3, [Validators.required, Validators.min(1), Validators.max(1000)]],
      limitA: [25, [Validators.required, Validators.min(1), Validators.max(1000)]],
      limitB: [50, [Validators.required, Validators.min(1), Validators.max(1000)]],
      maxGameLength: [50, [Validators.required, Validators.min(1), Validators.max(1000000)]],
      numberOfGames: [20, [Validators.required, Validators.min(1), Validators.max(1000000)]],
      progressReportFrequency: [5, [Validators.required, Validators.min(1), Validators.max(1000000)]]
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
        this.parameterForm.value.limitA,
        this.parameterForm.value.limitB,
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