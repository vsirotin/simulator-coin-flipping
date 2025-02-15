import { Experiment, IExprerimentInput, IExprerimentOutput } from "./experiment";

export interface IExprerimentSerieInput {};
export interface IExprerimentSerieOutput {};
export interface IExperimentSerieIntermediateState {};


export abstract class ExperimentSerie {
    protected isAborted = false;

    constructor(private experiment: Experiment) {}

    async runExperimentSerie(
        experimentSerieInput: IExprerimentSerieInput,
        progressReportFrequency: number,
        onProgress: (state: IExperimentSerieIntermediateState) => void): Promise<IExprerimentSerieOutput | null> {
            this.isAborted = false;
            let experimentInput: IExprerimentInput = this.prepareExperimentSerie(experimentSerieInput);
            let stepsWithoutProgressReport = 0;
            let experimentOutput: IExprerimentSerieOutput|null = null;
            let stepNumber = 0;
            while(!this.isAborted){
                let stepOutput: IExprerimentStepOutput = this.experimentStep.runExperimentStep(experimentInput);
                stepNumber++;
                experimentOutput = this.updateExperimentOutput(experimentOutput, stepOutput, stepNumber);
                if(stepsWithoutProgressReport++ >= progressReportFrequency){
                    stepsWithoutProgressReport = 0;
                    let intermidateStae: IExperimentSerieIntermediateState = this.createIntermidateState(experimentOutput, stepOutput, stepNumber);
                    onProgress(intermidateStae);
                }
                let isCompleted = this.isExperimentCompleted(stepOutput, experimentOutput, stepNumber);
                if(isCompleted){
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            return experimentOutput;
    }
  
    stopExperiment(): void{
        this.isAborted = true;
    }

    abstract prepareExperimentSerie(input: IExprerimentSerieInput): IExprerimentInput
    abstract updateExperimentOutput(
        experimentSerieOutput: IExprerimentSerieOutput|null, 
        experimentOutput: IExprerimentOutput,
        stepNumber: number): IExprerimentSerieOutput;
    abstract createIntermidateState(
        experimentSerieOutput: IExprerimentSerieOutput, 
        experimentOutput: IExprerimentOutput,
        experimentNumber: number): IExperimentSerieIntermediateState;

    abstract isExperimentCompleted(
        experimentOutput: IExprerimentOutput, 
        experimentSerieOutput: IExprerimentSerieOutput, 
        experimentNumber: number): boolean;
}    