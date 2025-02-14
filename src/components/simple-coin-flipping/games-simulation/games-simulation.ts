export interface GameState {
  numberOfSteps: number;
  winA: boolean;
  winB: boolean;
  relativeDeviation: number;
}

export interface GlobalMap {
  [steps: number]: {
    winsA: number;
    winsB: number;
    draws: number;
    relativeDeviation: number;
  };
}

export class GamesSimulation {
  private isAborted = false;
  private globalMap: GlobalMap = {};

  constructor(
    private betA: number,
    private betB: number,
    private maxGameLength: number,
    private numberOfGames: number
  ) {}

  public async startSimulation(
    onProgress: (state: GameState) => void,
    onComplete: (globalMap: GlobalMap) => void
  ) {
    this.isAborted = false;
    for (let i = 0; i < this.numberOfGames; i++) {
      if (this.isAborted) break;
      const state = this.runSingleGame();
      this.updateGlobalMap(state);
      onProgress(state);
      // Yield control back to the event loop
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    onComplete(this.globalMap);
  }

  public stopSimulation() {
    this.isAborted = true;
  }

  private runSingleGame(): GameState {
    let steps = 0;
    let currentBetA = this.betA;
    let currentBetB = this.betB;
    let headsCount = 0;
    let tailsCount = 0;

    while (steps < this.maxGameLength && currentBetA > 0 && currentBetB > 0) {
      steps++;
      const flip = Math.random() < 0.5 ? 'heads' : 'tails';
      if (flip === 'heads') {
        headsCount++;
        currentBetA--;
        currentBetB++;
      } else {
        tailsCount++;
        currentBetA++;
        currentBetB--;
      }
    }

    const winA = currentBetB === 0;
    const winB = currentBetA === 0;
    const relativeDeviation = Math.abs(headsCount - tailsCount) / steps;

    return {
      numberOfSteps: steps,
      winA,
      winB,
      relativeDeviation
    };
  }

  private updateGlobalMap(state: GameState) {
    const { numberOfSteps, winA, winB, relativeDeviation } = state;
    if (!this.globalMap[numberOfSteps]) {
      this.globalMap[numberOfSteps] = {
        winsA: 0,
        winsB: 0,
        draws: 0,
        relativeDeviation: 0
      };
    }

    const entry = this.globalMap[numberOfSteps];
    if (winA) {
      entry.winsA++;
    } else if (winB) {
      entry.winsB++;
    } else {
      entry.draws++;
    }

    const totalGames = entry.winsA + entry.winsB + entry.draws;
    entry.relativeDeviation =
      (entry.relativeDeviation * (totalGames - 1) + relativeDeviation) / totalGames;
  }
}