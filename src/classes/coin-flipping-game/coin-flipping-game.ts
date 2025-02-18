import { LoggerFactory } from "@vsirotin/log4ts";
import { IExperimentStep, IExprerimentInput, IExprerimentOutput, IExperimentIntermediateState, Experiment } from "../experiment/experiment";


export class CoinFlipping implements IExperimentStep<number, boolean> {
  generatorUniformDistribution: IGeneratorUniformDistributionBoolean = new GeneratorUniformDistributionBoolean();
  runExperimentStep(inputParameters: number = 0): boolean {
    return this.generatorUniformDistribution.generate();
  }

}

export class CoinFlippingGameInput implements IExprerimentInput {
  constructor(
    public betA: number,
    public betB: number,
    public maxGameLength: number
  ) { }
}

export class CoinFiippingGameOutput implements IExprerimentOutput {
  constructor(
    public isWinnerA: boolean,
    public idDraw: boolean,
    public numberOfSteps: number,
    public relativeDeviation: number
  ) { }
}

export class CoinFlippinGameIntermediateState implements IExperimentIntermediateState {
  constructor(
    public betA: number,
    public betB: number,
    public numberFilippingasA: number
  ) { }
}

export class CoinFlippingGame extends Experiment<number, boolean, CoinFlippingGameInput, CoinFiippingGameOutput, CoinFlippinGameIntermediateState> {

  private logger1 = LoggerFactory.getLogger("CoinFlippingGame");

  override experimentStep: CoinFlipping = new CoinFlipping();

  maxGameLength: number = 0;

  override prepareExperiment(input: CoinFlippingGameInput): CoinFlippinGameIntermediateState {
    this.maxGameLength = input.maxGameLength;
    return new CoinFlippinGameIntermediateState(input.betA, input.betB, 0);
  }

  override prepareExperimentStep(state: CoinFlippinGameIntermediateState, stepNumber: number): number {
    //do nothing
    return 0;
  }

  override updateIntermidateState(oldState: CoinFlippinGameIntermediateState, stepOutput: boolean, stepNumber: number): CoinFlippinGameIntermediateState {
    let difWinA = -1;
    let difNumberFilippingasA = 0;
    if (stepOutput) {
      difWinA = 1;
      difNumberFilippingasA = 1;
    }

    let newState = new CoinFlippinGameIntermediateState(oldState.betA + difWinA, oldState.betB - difWinA, oldState.numberFilippingasA + difNumberFilippingasA);
    this.logger1.debug("Step:", stepNumber, "intermediateState:", oldState, "newState:", newState);
    return newState;
  }
  override isExperimentCompleted(stepOutput: boolean, intermediateState: CoinFlippinGameIntermediateState, stepNumber: number): boolean {
    return intermediateState.betA === 0 || intermediateState.betB === 0 || stepNumber >= this.maxGameLength;
  }
  override generateOutput(intermediateState: CoinFlippinGameIntermediateState, stepNumber: number): CoinFiippingGameOutput {
    let relativeDeviation = Math.abs((stepNumber/2.0 - intermediateState.numberFilippingasA) / stepNumber);
    return new CoinFiippingGameOutput(intermediateState.betA === 0, !(intermediateState.betA === 0 || intermediateState.betB === 0), stepNumber, relativeDeviation);
  }

}

export interface IGeneratorUniformDistributionBoolean {
  generate(): boolean;
}

export class GeneratorUniformDistributionBoolean implements IGeneratorUniformDistributionBoolean {
  generate(): boolean {
    return Math.random() < 0.5;
  }
}
