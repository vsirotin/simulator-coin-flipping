import { LoggerFactory } from "@vsirotin/log4ts";
import { IExprerimentOutput } from "../experiment/experiment";
import { ExperimentSerie } from "../experiment/experiment-serie";
import { CoinFiippingGameOutput, CoinFlippingGame, CoinFlippingGameInput } from "./coin-flipping-game";

export class CoinFlippingGameSerieInput {
    constructor(
      public numberExperiments: number,
      public defaultCoinFlippingGameInput: CoinFlippingGameInput
    ) { }
  }
  
  export class CoinFiippingGameSerieOutput implements IExprerimentOutput {
    constructor(
      public gamesWithWinnerA: Map<number, number>,
      public gamesWithWinnerB: Map<number, number>,
      public gamesWithDraw: Map<number, number>,
      public relativeDeviation: number
    ) { }
  }
export class CoinFlippingExperimentSerie extends ExperimentSerie<CoinFiippingGameSerieOutput, CoinFiippingGameSerieOutput> {
  
   private logger1 = LoggerFactory.getLogger("CoinFlippingExperimentSerie"); 
   private result = new CoinFiippingGameSerieOutput(new Map(), new Map(), new Map(), 0);
   private commonStepsCount = 0;
   
   
   constructor(private readonly input: CoinFlippingGameSerieInput){
    super(new CoinFlippingGame(input.defaultCoinFlippingGameInput));
    this.logger1.log("CoinFlippingExperimentSerie created input:", input);
   };

   protected override prepareExperimentSerie(): void {
        super.experiment = new CoinFlippingGame(this.input.defaultCoinFlippingGameInput)
    }

    protected override updateExperimentSerieState(experimentResult: CoinFiippingGameOutput | null) : void{

        if(experimentResult === null){
            this.logger1.error("Experiment result is null");
            return;
        }

        let difWinA = 0;
        let difWinDraw = 0;
        let difWinB = 1;

        if(experimentResult.isWinnerA){
            difWinA = 1;
            difWinB = 0;
        } else if(experimentResult.idDraw){
            difWinDraw = 1;
            difWinB = 0;
        }

        const numberSteps = experimentResult.numberOfSteps;
        
        const newRelativeDEvitation = this.result.relativeDeviation * this.commonStepsCount 
            + experimentResult.relativeDeviation * experimentResult.numberOfSteps/(this.commonStepsCount + numberSteps);
        this.commonStepsCount += numberSteps;

        this.result = new CoinFiippingGameSerieOutput(
            this.updateMap(this.result.gamesWithWinnerA, difWinA, numberSteps), 
            this.updateMap(this.result.gamesWithWinnerB, difWinB, numberSteps), 
            this.updateMap(this.result.gamesWithDraw, difWinDraw, numberSteps),
            newRelativeDEvitation
        );

        this.logger1.debug("Experiment serie state updated:", this.result);

    }
    private updateMap(gamesWithWinnerA: Map<number, number>, difWin: number, numberSteps: number): Map<number, number> {
        const key = numberSteps;
        const value = gamesWithWinnerA.get(key) || 0;
        const newValue = value + difWin;
        gamesWithWinnerA.set(key, newValue);
        return gamesWithWinnerA;
    }
    
    protected override generateIntermidateState(): CoinFiippingGameSerieOutput {
        return this.result;
    }
    protected override isExperimentSerieCompleted(): boolean {
        return this.experimentNumber >=  this.input.numberExperiments;
    }
   
    protected override generateOutput(): CoinFiippingGameSerieOutput {
        this.logger1.log("End experiment serie result:", this.result);
        return this.result;
    };  
    
}
