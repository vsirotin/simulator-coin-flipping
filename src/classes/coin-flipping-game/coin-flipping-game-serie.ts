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
   private countFlippingACommon = 0;
   
   
   constructor(private readonly input: CoinFlippingGameSerieInput){
    super(new CoinFlippingGame(input.defaultCoinFlippingGameInput));
    this.logger1.log("CoinFlippingExperimentSerie created input:", input);
   };

   protected override prepareExperimentSerie(): void {
        super.experiment = new CoinFlippingGame(this.input.defaultCoinFlippingGameInput)
        this.countFlippingACommon = 0;
    }

    protected override prepareExperiment(): void {
        //this.commonStepsCount = 0;
        //this.countFlippingACommon = 0;
        super.experiment = new CoinFlippingGame(this.input.defaultCoinFlippingGameInput);
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
        } else if(experimentResult.isDraw){
            difWinDraw = 1;
            difWinB = 0;
        }

        const numberSteps = experimentResult.numberOfSteps;
        this.commonStepsCount += numberSteps;
        this.countFlippingACommon += experimentResult.countFlippingA;
        
        const relativeDevitation = Math.abs(this.commonStepsCount/2.0 - this.countFlippingACommon)/this.commonStepsCount;

        this.result = new CoinFiippingGameSerieOutput(
            this.updateMap(this.result.gamesWithWinnerA, difWinA, numberSteps), 
            this.updateMap(this.result.gamesWithWinnerB, difWinB, numberSteps), 
            this.updateMap(this.result.gamesWithDraw, difWinDraw, numberSteps),
            relativeDevitation
        );

        this.logger1.debug("Experiment serie state updated:", this.result);

    }
    private updateMap(gamesWithWinnerX: Map<number, number>, difWin: number, numberSteps: number): Map<number, number> {
        if(difWin === 0){
            return gamesWithWinnerX;
        };
        const key = numberSteps;
        const value = gamesWithWinnerX.get(key) || 0;
        const newValue = value + difWin;
        gamesWithWinnerX.set(key, newValue);
        return gamesWithWinnerX;
    }
    
    protected override generateIntermidateState(): CoinFiippingGameSerieOutput {
        return this.result;
    }
    protected override isExperimentSerieCompleted(): boolean {
        return this.experimentNumber >  this.input.numberExperiments;
    }
   
    protected override generateOutput(): CoinFiippingGameSerieOutput {
        this.logger1.log("End experiment serie result:", this.result);
        return this.result;
    };  
    
}
