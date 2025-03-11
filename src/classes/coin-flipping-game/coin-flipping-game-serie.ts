import { LoggerFactory } from "@vsirotin/log4ts";
import { IExprerimentOutput } from "../experiment/experiment";
import { ExperimentSerie } from "../experiment/experiment-serie";
import { CoinFiippingGameOutput, CoinFlippingGame, CoinFlippingGameInput } from "./coin-flipping-game";

export class CoinFlippingGameSerieInput {
    constructor(
        public numberExperiments: number,
        public limitA: number,
        public limitB: number,
        public defaultCoinFlippingGameInput: CoinFlippingGameInput
    ) { }
  }
  
  export class CoinFiippingGameSerieOutput implements IExprerimentOutput {
    constructor(
      public gamesWithWinnerA: Map<number, number>,
      public gamesWithWinnerB: Map<number, number>,
      public gamesWithDraw: Map<number, number>,
      public walletA: number[], // State of vallet for each step (coin flip)
      public walletB: number[],
      public relativeDeviation: number
    ) { }
  }
export class CoinFlippingExperimentSerie extends ExperimentSerie<CoinFiippingGameSerieOutput, CoinFiippingGameSerieOutput> {
  
   private logger1 = LoggerFactory.getLogger("CoinFlippingExperimentSerie"); 
   private result = new CoinFiippingGameSerieOutput(new Map(), new Map(), new Map(), new Array<number>(), new Array<number>(), 0);
   private commonStepsCount = 0;
   private countFlippingACommon = 0;
   private betA: number;
   private betB: number;
   
   
   
   constructor(private readonly input: CoinFlippingGameSerieInput){
    super(new CoinFlippingGame(input.defaultCoinFlippingGameInput));
    this.logger1.log("CoinFlippingExperimentSerie created input:", input);
    this.betA = input.defaultCoinFlippingGameInput.betA;
    this.betB = input.defaultCoinFlippingGameInput.betB;
    this.result.walletA.push(this.input.limitA);
    this.result.walletB.push(this.input.limitB);
   };

   getCurrentExperimentProgress(): number {
       return this.experimentNumber/this.input.numberExperiments;
    }

   protected override prepareExperimentSerie(): void {
        super.experiment = new CoinFlippingGame(this.input.defaultCoinFlippingGameInput)
        this.countFlippingACommon = 0;
    }

    protected override prepareExperiment(): void {
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
        const n = this.experimentNumber - 1;
        let walletAState = this.result.walletA[n];
        let walletBState = this.result.walletB[n];

        if(experimentResult.isWinnerA){
            difWinA = 1;
            difWinB = 0;
            walletAState += this.betB;
            walletBState -= this.betB;
        } else if(experimentResult.isDraw){
            difWinDraw = 1;
            difWinB = 0;
        } else {
            //Winer is B
            walletAState -= this.betA;
            walletBState += this.betA;
        }

        this.result.walletA.push(walletAState);
        this.result.walletB.push(walletBState);

        const numberSteps = experimentResult.numberOfSteps;
        this.commonStepsCount += numberSteps;
        this.countFlippingACommon += experimentResult.countFlippingA;
        
        const relativeDevitation = Math.abs(this.commonStepsCount/2.0 - this.countFlippingACommon)/this.commonStepsCount;  

        this.result = new CoinFiippingGameSerieOutput(
            this.updateMap(this.result.gamesWithWinnerA, difWinA, numberSteps), 
            this.updateMap(this.result.gamesWithWinnerB, difWinB, numberSteps), 
            this.updateMap(this.result.gamesWithDraw, difWinDraw, numberSteps),
            this.result.walletA,
            this.result.walletB,
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
        if(this.experimentNumber >  this.input.numberExperiments) {
            return true;
        }
        if(this.result.walletA[this.experimentNumber -1] - this.input.defaultCoinFlippingGameInput.betA < 0){
            return true;
        }

        if(this.result.walletB[this.experimentNumber - 1] - this.input.defaultCoinFlippingGameInput.betB < 0){
            return true;
        }

        return false;
    }
   
    protected override generateOutput(): CoinFiippingGameSerieOutput {
        this.logger1.log("End experiment serie result:", this.result);
        return this.result;
    };  
    
}
