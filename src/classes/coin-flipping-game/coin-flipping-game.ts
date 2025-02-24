import { LoggerFactory } from "@vsirotin/log4ts";
import { IExprerimentOutput, Experiment, IExperimentStep } from "../experiment/experiment";


class CoinFlipping implements IExperimentStep {
  generatorUniformDistribution: IGeneratorUniformDistributionBoolean = new GeneratorUniformDistributionBoolean();
  betA: number;
  betB: number;

  static countFlippingAInSteps = 0;

  constructor(input: CoinFlippingGameInput) {
    this.betA = input.betA;
    this.betB = input.betB;
  }
  runExperimentStep(): void {
    const result = this.generatorUniformDistribution.generate();

    if(result){
      this.betA++;
      this.betB--;
      CoinFlipping.countFlippingAInSteps++;
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
    public isDraw: boolean,
    public numberOfSteps: number,
    public countFlippingA: number
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
    this.logger1.log("CoinFlippingGame created input:", input);
  }

  override prepareExperiment(): void {
    CoinFlipping.countFlippingAInSteps = 0;
  }

  override isExperimentCompleted(): boolean {
    return this.experimentStep.betA <= 0 || this.experimentStep.betB <= 0 || this.stepNumber >= this.maxGameLength;
  }

  override async runExperiment(): Promise<CoinFiippingGameOutput | null> {
      const result = await super.runExperiment();
      this.logger1.debug("runExperiment result:", result);
      return result;
  }
  override generateOutput(): CoinFiippingGameOutput {
    const result = new CoinFiippingGameOutput(this.experimentStep.betB === 0, 
      !(this.experimentStep.betA === 0 || this.experimentStep.betB === 0), 
      this.stepNumber, 
      CoinFlipping.countFlippingAInSteps);
      this.logger1.debug("generateOutput this:", this, "result:", result);
      return result;
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
