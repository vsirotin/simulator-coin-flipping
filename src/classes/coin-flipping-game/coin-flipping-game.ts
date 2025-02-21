import { LoggerFactory } from "@vsirotin/log4ts";
import { IExprerimentOutput, Experiment, IExperimentStep } from "../experiment/experiment";


class CoinFlipping implements IExperimentStep {
  generatorUniformDistribution: IGeneratorUniformDistributionBoolean = new GeneratorUniformDistributionBoolean();
  betA: number;
  betB: number;
  countFlippingA = 0;

  constructor(input: CoinFlippingGameInput) {
    this.betA = input.betA;
    this.betB = input.betB;
  }
  runExperimentStep(): void {
    const result = this.generatorUniformDistribution.generate();
    if(result){
      this.betA++;
      this.betB--;
      this.countFlippingA++;
      return
    }
    this.betA--;
    this.betB++;
  }

}

export class CoinFlippingGameInput {
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

export class CoinFlippingGame extends Experiment<CoinFiippingGameOutput> {


  private logger1 = LoggerFactory.getLogger("CoinFlippingGame");

  override experimentStep: CoinFlipping;

  maxGameLength: number = 0;

  constructor(input: CoinFlippingGameInput) {
    super(new CoinFlipping(input));
    this.maxGameLength = input.maxGameLength;
    this.experimentStep = new CoinFlipping(input);
  }

  override isExperimentCompleted(): boolean {
    return this.experimentStep.betA === 0 || this.experimentStep.betB === 0 || this.stepNumber >= this.maxGameLength;
  }
  override generateOutput(): CoinFiippingGameOutput {
    return new CoinFiippingGameOutput(this.experimentStep.betA === 0, 
      !(this.experimentStep.betA === 0 || this.experimentStep.betB === 0), 
      this.stepNumber, Math.abs((this.stepNumber / 2.0 - this.experimentStep.countFlippingA) / this.stepNumber / 2.0));
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
