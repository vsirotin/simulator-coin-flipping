import { LoggerFactory } from "@vsirotin/log4ts";
import { Experiment, IExprerimentOutput } from "./experiment";

export interface IExprerimentSerieOutput {};
export interface IExperimentSerieIntermediateState {};


export abstract class ExperimentSerie <IExprerimentSerieOutput, IExperimentSerieIntermediateState>{
    private logger = LoggerFactory.getLogger("ExperimentSerie");
    protected isAborted = false;
    protected experimentNumber = 0

    constructor(protected experiment : Experiment<IExprerimentOutput>){}

    async runExperimentSerie(
        progressReportFrequency: number,
        onProgress: (state: IExperimentSerieIntermediateState) => void): Promise<IExprerimentSerieOutput> {
            this.logger.log("Start experiment serie");
            this.isAborted = false;
            this.experimentNumber = 0;
            
            let experimentsCountWithoutProgressReport = 0;
            this.prepareExperimentSerie();
            
            while(!this.isAborted){
                this.prepareExperiment();
                let experimentResult = await this.experiment.runExperiment();
                this.updateExperimentSerieState(experimentResult);
                this.experimentNumber++;
            
                this.logger.debug("Experiment:", this.experimentNumber,"experimentResult=", experimentResult);
                if(experimentsCountWithoutProgressReport++ >= progressReportFrequency){
                    experimentsCountWithoutProgressReport = 0;
                    this.logger.debug("Before call rogress report");
                    onProgress(this.generateIntermidateState());
                }
                let isCompleted = this.isExperimentSerieCompleted();
                if(isCompleted){
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            let experimentSerieOutput = this.generateOutput();
            this.logger.log("End experiment serie result:", experimentSerieOutput);
            return experimentSerieOutput;
    }
   
    
  
    stopExperiment(): void{
        this.logger.log("Stop experiment serie");
        this.isAborted = true;
    }

    protected prepareExperiment(): void {};

    protected prepareExperimentSerie(): void {};

    protected abstract updateExperimentSerieState(experimentResult: IExprerimentOutput | null) : void;

    protected abstract generateIntermidateState(): IExperimentSerieIntermediateState;

    protected abstract isExperimentSerieCompleted(): boolean;

    protected abstract generateOutput(): IExprerimentSerieOutput    
}    