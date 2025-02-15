
export interface IExprerimentStepInput {};
export interface IExprerimentStepOutput {};

export interface IExperimentStep {
    runExperimentStep(inputParameters: IExprerimentStepInput): IExprerimentStepOutput; 
}

export interface IExprerimentInput {};
export interface IExprerimentOutput {};
export interface IExperimentIntermediateState {};


export abstract class Experiment {
    protected isAborted = false;

    constructor(private experimentStep: IExperimentStep) {}

    async runExperiment(
        experimentInput: IExprerimentInput,
        progressReportFrequency: number,
        onProgress: (state: IExperimentIntermediateState) => void): Promise<IExprerimentOutput | null> {
            this.isAborted = false;
            let stepInput: IExprerimentStepInput = this.prepareExperiment(experimentInput);
            let stepsWithoutProgressReport = 0;
            let experimentOutput: IExprerimentOutput|null = null;
            let stepNumber = 0;
            while(!this.isAborted){
                let stepOutput: IExprerimentStepOutput = this.experimentStep.runExperimentStep(stepInput);
                stepNumber++;
                experimentOutput = this.updateExperimentOutput(experimentOutput, stepOutput, stepNumber);
                if(stepsWithoutProgressReport++ >= progressReportFrequency){
                    stepsWithoutProgressReport = 0;
                    let intermidateStae: IExperimentIntermediateState = this.createIntermidateState(experimentOutput, stepOutput, stepNumber);
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

    abstract prepareExperiment(input: IExprerimentInput): IExprerimentStepInput
    abstract updateExperimentOutput(
        experimentOutput: IExprerimentOutput|null, 
        stepOutput: IExprerimentStepOutput,
        stepNumber: number): IExprerimentOutput;
    abstract createIntermidateState(
        experimentOutput: IExprerimentOutput, 
        stepOutput: IExprerimentStepOutput,
        stepNumber: number): IExperimentIntermediateState;

    abstract isExperimentCompleted(
        stepOutput: IExprerimentStepOutput, 
        experimentOutput: IExprerimentOutput, 
        stepNumber: number): boolean;
}    