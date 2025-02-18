import { LoggerFactory } from "@vsirotin/log4ts";
import { Experiment, IExperimentIntermediateState, IExprerimentInput, IExprerimentOutput, IExprerimentStepInput, IExprerimentStepOutput } from "./experiment";

export interface IExprerimentSerieInput {};
export interface IExprerimentSerieOutput {};
export interface IExperimentSerieIntermediateState {};


export abstract class ExperimentSerie <IExprerimentSerieInput, IExprerimentSerieOutput, IExperimentSerieIntermediateState>{
    private logger = LoggerFactory.getLogger("ExperimentSerie");
    protected isAborted = false;

    abstract experiment: Experiment<IExprerimentStepInput, IExprerimentStepOutput, IExprerimentInput, IExprerimentOutput, IExperimentIntermediateState>


    async runExperimentSerie(
        experimentSerieInput: IExprerimentSerieInput,
        progressReportFrequency: number,
        onProgress: (state: IExperimentSerieIntermediateState) => void): Promise<IExprerimentSerieOutput | null> {
            this.isAborted = false;
            
            let experimentsCountWithoutProgressReport = 0;
            let intermidateState: IExperimentSerieIntermediateState = this.prepareExperimentSerie(experimentSerieInput);
            this.logger.log("Start experiment serie. intermediateState:", intermidateState);
            let experimentNumber = 0;
            while(!this.isAborted){
                let experimentInput: IExprerimentInput = this.prepareExperiment(intermidateState, experimentNumber);
                let experimentOutput: IExprerimentOutput | null = await this.experiment.runExperiment(experimentInput);
                experimentNumber++;
                intermidateState = this.updateExperimentSerieState(intermidateState, experimentOutput, experimentNumber);
                this.logger.debug("Experiment:", experimentNumber, "intermediateState:", intermidateState);
                if(experimentsCountWithoutProgressReport++ >= progressReportFrequency){
                    experimentsCountWithoutProgressReport = 0;
                    onProgress(intermidateState);
                }
                let isCompleted = this.isExperimentSerieCompleted(experimentSerieInput, intermidateState, experimentNumber);
                if(isCompleted){
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            let experimentSerieOutput = this.generateOutput(experimentSerieInput, intermidateState, experimentNumber);
            this.logger.log("End experiment serie result:", experimentSerieOutput);
            return experimentSerieOutput;
    }
    
  
    stopExperiment(): void{
        this.logger.log("Stop experiment serie");
        this.isAborted = true;
    }

    abstract prepareExperimentSerie(input: IExprerimentSerieInput): IExperimentSerieIntermediateState

    abstract prepareExperiment<IExperimentSerirIntermediateState>(intermidateState: IExperimentSerirIntermediateState, experimentNumber: number): IExprerimentInput;

    abstract updateExperimentSerieState(
        experimentSerieState: IExperimentSerieIntermediateState, 
        experimentOutput: IExprerimentOutput | null,
        experimentNumber: number): IExperimentSerieIntermediateState;

    abstract isExperimentSerieCompleted(
        experimentOutput: IExprerimentSerieInput, 
        intermidateState:  IExperimentSerieIntermediateState, 
        experimentNumber: number): boolean;

    abstract generateOutput(input: IExprerimentSerieInput, intermediateState: IExperimentSerieIntermediateState, stepNumber: number): IExprerimentSerieOutput    
}    