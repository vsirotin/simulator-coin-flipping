import { Experiment, IExprerimentStepInput, IExprerimentStepOutput, IExprerimentInput, IExprerimentOutput, IExperimentIntermediateState } from "../experiment/experiment";
import { ExperimentSerie, IExperimentSerieIntermediateState, IExprerimentSerieInput, IExprerimentSerieOutput } from "../experiment/experiment-serie";
import { CoinFlippingGame } from "./coin-flipping-game";

export class CoinFlippingExperimentSerie extends ExperimentSerie<IExprerimentSerieInput, IExprerimentSerieOutput, IExperimentSerieIntermediateState> {
    
    override experiment: CoinFlippingGame = new CoinFlippingGame();
    
    override prepareExperimentSerie(input: IExprerimentSerieInput): IExperimentSerieIntermediateState {
        throw new Error("Method not implemented.");
    }
    override prepareExperiment<IExperimentSerirIntermediateState>(intermidateState: IExperimentSerirIntermediateState, experimentNumber: number): IExprerimentInput {
        throw new Error("Method not implemented.");
    }
    override updateExperimentSerieState(experimentSerieState: IExperimentSerieIntermediateState, experimentOutput: IExprerimentOutput | null, experimentNumber: number): IExperimentSerieIntermediateState {
        throw new Error("Method not implemented.");
    }
    override isExperimentSerieCompleted(experimentOutput: IExprerimentSerieInput, intermidateState: IExperimentSerieIntermediateState, experimentNumber: number): boolean {
        throw new Error("Method not implemented.");
    }
    override generateOutput(input: IExprerimentSerieInput, intermediateState: IExperimentSerieIntermediateState, stepNumber: number): IExprerimentSerieOutput {
        throw new Error("Method not implemented.");
    }
    
}