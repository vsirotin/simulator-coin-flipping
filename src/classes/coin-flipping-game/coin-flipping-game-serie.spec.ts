import { CoinFlippingExperimentSerie, CoinFlippingGameSerieInput, CoinFiippingGameSerieOutput } from './coin-flipping-game-serie';
import { CoinFlippingGameInput, CoinFiippingGameOutput } from './coin-flipping-game';
import { LoggerFactory } from '@vsirotin/log4ts';

describe('CoinFlippingExperimentSerie', () => {
  let experimentSerie: CoinFlippingExperimentSerie;

  let callsCountOnProgress = 0;

  function onProgress (state: CoinFiippingGameSerieOutput): void {
      callsCountOnProgress++;
  }

  beforeEach(() => {    
    callsCountOnProgress = 0;
  });

  it('should create an instance of CoinFlippingExperimentSerie', () => {
    const defaultInput = new CoinFlippingGameInput(1, 1, 1);
    const serieInput = new CoinFlippingGameSerieInput(1, defaultInput);
    experimentSerie = new CoinFlippingExperimentSerie(serieInput);
    expect(experimentSerie).toBeTruthy();
  });

  it('by 100 experiments with betA=1, betB=1, maxGameLength=3 shuld NOT be draws', async () => {
    const input = new CoinFlippingGameInput(1, 1, 3);
    const serieInput = new CoinFlippingGameSerieInput(100, input);
    experimentSerie = new CoinFlippingExperimentSerie(serieInput);

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

  it('By run 100 experiments with betA=3, betB=5, maxGameLength=9 should not be wins by game length 4,6,8', async () => {
    const input = new CoinFlippingGameInput(3, 5, 9);
    const serieInput = new CoinFlippingGameSerieInput(100, input);
    experimentSerie = new CoinFlippingExperimentSerie(serieInput);
    const result = await experimentSerie.runExperimentSerie(10, onProgress);

    const keysWithWinnerA = result.gamesWithWinnerA.keys();
    expect(keysWithWinnerA).not.toContain(4);
    expect(keysWithWinnerA).not.toContain(6);
    expect(keysWithWinnerA).not.toContain(8);

    const keysWithWinnerB = result.gamesWithWinnerB.keys();
    expect(keysWithWinnerB).not.toContain(4);
    expect(keysWithWinnerB).not.toContain(6);
    expect(keysWithWinnerB).not.toContain(8);

    const keysWithDraw = result.gamesWithDraw;
    expect(keysWithDraw.size).toEqual(1);
    const comonCount = result.gamesWithDraw.get(9)!! 
      + result.gamesWithWinnerA.get(5)!! + result.gamesWithWinnerA.get(7)!! + result.gamesWithWinnerA.get(9)!!
      + result.gamesWithWinnerB.get(3)!! + result.gamesWithWinnerB.get(5)!! + result.gamesWithWinnerB.get(7)!!  + result.gamesWithWinnerB.get(9)!!;
    expect(comonCount).toEqual(100);
  });

  it('By run many experiments the ptocess can be stopped', async () => {

    function onProgress1 (state: CoinFiippingGameSerieOutput): void {
      callsCountOnProgress++;
      experimentSerie.stopExperimentSerie();
    }

    const input = new CoinFlippingGameInput(3, 5, 9);
    const serieInput = new CoinFlippingGameSerieInput(100, input);
    experimentSerie = new CoinFlippingExperimentSerie(serieInput);
    const result = await experimentSerie.runExperimentSerie(10, onProgress1);


    expect(callsCountOnProgress).toEqual(1);
  });
 
});