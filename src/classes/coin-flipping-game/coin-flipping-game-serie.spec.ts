import { CoinFlippingExperimentSerie, CoinFlippingGameSerieInput, CoinFiippingGameSerieOutput } from './coin-flipping-game-serie';
import { CoinFlippingGameInput, CoinFiippingGameOutput } from './coin-flipping-game';
import { LoggerFactory } from '@vsirotin/log4ts';

describe('CoinFlippingExperimentSerie', () => {
  let experimentSerie: CoinFlippingExperimentSerie;

  beforeEach(() => {
    const defaultInput = new CoinFlippingGameInput(5, 5, 10);
    const serieInput = new CoinFlippingGameSerieInput(3, defaultInput);
    experimentSerie = new CoinFlippingExperimentSerie(serieInput);
  });

  it('should create an instance of CoinFlippingExperimentSerie', () => {
    expect(experimentSerie).toBeTruthy();
  });

  it('should run 100 experiments with betA=1, betB=1, maxGameLength=3 with expected results', async () => {
    const input = new CoinFlippingGameInput(1, 1, 3);
    const serieInput = new CoinFlippingGameSerieInput(100, input);
    experimentSerie = new CoinFlippingExperimentSerie(serieInput);

    let callsCountOnProgress = 0;

    function onProgress (state: CoinFiippingGameSerieOutput): void {
        callsCountOnProgress++;
    }


    const result = await experimentSerie.runExperimentSerie(10, onProgress);
    expect(callsCountOnProgress).toEqual(9);
    expect(result.relativeDeviation).toBeLessThan(0.15);
    
    expect(result.gamesWithDraw.size).toEqual(0);
    expect(result.gamesWithWinnerA.size).toEqual(1);
    expect(result.gamesWithWinnerB.size).toEqual(1);
    
    const gamesWithWinnerA = result.gamesWithWinnerA.get(1) || 0;
    const gamesWithWinnerB = result.gamesWithWinnerB.get(1) || 0;
    expect(gamesWithWinnerA + gamesWithWinnerB).toEqual(100);
    expect(gamesWithWinnerA).toBeGreaterThan(30);
    expect(gamesWithWinnerB).toBeGreaterThan(30);
    
  });

//   it('should run 100 experiments with betA=3, betB=7, maxGameLength=3 and check steps', async () => {
//     const input = new CoinFlippingGameInput(3, 7, 3);
//     const serieInput = new CoinFlippingGameSerieInput(100, input);
//     experimentSerie = new CoinFlippingExperimentSerie(serieInput);

//     const onProgress = jasmine.createSpy('onProgress');
//     const onComplete = jasmine.createSpy('onComplete');

//     await experimentSerie.runExperimentSerie(10, onProgress);

//     const result = experimentSerie.generateOutput();
//     expect(result).toBeTruthy();
//     expect(onProgress).toHaveBeenCalled();
//     expect(onComplete).not.toHaveBeenCalled();

//     // Check that there are no games completed after 4 and 5 steps
//     expect(result.gamesWithWinnerA.get(4)).toBeUndefined();
//     expect(result.gamesWithWinnerA.get(5)).toBeUndefined();
//     expect(result.gamesWithWinnerB.get(4)).toBeUndefined();
//     expect(result.gamesWithWinnerB.get(5)).toBeUndefined();
//     expect(result.gamesWithDraw.get(4)).toBeUndefined();
//     expect(result.gamesWithDraw.get(5)).toBeUndefined();
//   });
 
});