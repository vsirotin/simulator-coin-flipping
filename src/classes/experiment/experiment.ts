import { LoggerFactory } from "@vsirotin/log4ts";



export interface IExperimentStep {
    runExperimentStep(): void; 
}

export interface IExprerimentInput {};
export interface IExprerimentOutput {};


export abstract class Experiment<IExprerimentOutput> {
    
    private logger = LoggerFactory.getLogger("Experiment");
    
    private isAborted = false;
    stepNumber = 0;

    constructor (protected experimentStep: IExperimentStep){};

    async runExperiment(): Promise<IExprerimentOutput | null> {
            this.logger.log("Start experiment");
            this.isAborted = false;
            this.prepareExperiment();
            this.stepNumber = 0;
            
            while(!this.isAborted){
                this.experimentStep.runExperimentStep();
                this.stepNumber++;
                let isCompleted = this.isExperimentCompleted();
                this.logger.debug("Step:", this.stepNumber, "isCompleted:", isCompleted);
                if(isCompleted){
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            let result = this.generateOutput(); 
            this.logger.log("End experiment result:", result);
            return result;   
        }
    
  
    stopExperiment(): void{
        this.logger.log("Stop experiment");
        this.isAborted = true;
    }

    protected prepareExperiment(): void {};

    abstract isExperimentCompleted(): boolean;

    abstract generateOutput(): IExprerimentOutput
}    