import { LoggerFactory } from "@vsirotin/log4ts";

export interface IExprerimentStepInput {};
export interface IExprerimentStepOutput {};

export interface IExperimentStep<IExprerimentStepInput, IExprerimentStepOutput> {
    runExperimentStep(inputParameters: IExprerimentStepInput): IExprerimentStepOutput; 
}

export interface IExprerimentInput {};
export interface IExprerimentOutput {};
export interface IExperimentIntermediateState {};


export abstract class Experiment<IExprerimentStepInput, IExprerimentStepOutput, IExprerimentInput, IExprerimentOutput, IExperimentIntermediateState> {
    
    private logger = LoggerFactory.getLogger("Experiment");
    
    private isAborted = false;

    abstract experimentStep: IExperimentStep<IExprerimentStepInput, IExprerimentStepOutput>;

    async runExperiment(
        experimentInput: IExprerimentInput): Promise<IExprerimentOutput | null> {

            this.isAborted = false;
            let intermediateState: IExperimentIntermediateState = this.prepareExperiment(experimentInput);
            this.logger.log("Start experiment. intermediateState:", intermediateState);
            let stepNumber = 0;
            
            while(!this.isAborted){
                let stepInput: IExprerimentStepInput = this.prepareExperimentStep(intermediateState, stepNumber);
                let stepOutput: IExprerimentStepOutput = this.experimentStep.runExperimentStep(stepInput);
                stepNumber++;
                intermediateState = this.updateIntermidateState(intermediateState, stepOutput, stepNumber);
                let isCompleted = this.isExperimentCompleted(stepOutput, intermediateState, stepNumber);
                this.logger.debug("Step:", stepNumber, "intermediateState:", intermediateState, "isCompleted:", isCompleted);
                if(isCompleted){
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            let result = this.generateOutput(intermediateState, stepNumber); 
            this.logger.log("End experiment result:", result);
            return result;   
        }
    
  
    stopExperiment(): void{
        this.logger.log("Stop experiment");
        this.isAborted = true;
    }

    abstract prepareExperiment(input: IExprerimentInput): IExperimentIntermediateState

    abstract prepareExperimentStep(state: IExperimentIntermediateState, stepNumber: number): IExprerimentStepInput
    
    abstract updateIntermidateState(
        intermediateState: IExperimentIntermediateState|null, 
        stepOutput: IExprerimentStepOutput,
        stepNumber: number): IExperimentIntermediateState;

    abstract isExperimentCompleted(
        stepOutput: IExprerimentStepOutput, 
        intermediateState: IExperimentIntermediateState, 
        stepNumber: number): boolean;

    abstract generateOutput(intermediateState: IExperimentIntermediateState | null, stepNumber: number): IExprerimentOutput
}    