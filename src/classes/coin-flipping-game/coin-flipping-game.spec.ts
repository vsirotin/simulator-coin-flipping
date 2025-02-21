import { CoinFlippingGame, CoinFlippingGameInput, CoinFiippingGameOutput } from './coin-flipping-game';

describe('CoinFlippingGame', () => {
    let game: CoinFlippingGame;

    beforeEach(() => {
        
    });

    it('should create an instance of CoinFlippingGame', () => {
        game = new CoinFlippingGame(new CoinFlippingGameInput(5, 5, 4));
        expect(game).toBeTruthy();
    });

    it('should result be draw when betA = 5, betB = 5, and maxGameLength = 4', async () => {
        game = new CoinFlippingGame(new CoinFlippingGameInput(5, 5, 4));
        const result = await game.runExperiment();

        expect(result?.idDraw).toBeTrue();
    });

    it('should result be NOT draw when betA = 1, betB = 1, and maxGameLength = 1', async () => {
        game = new CoinFlippingGame(new CoinFlippingGameInput(1, 1, 1));
        const result = await game.runExperiment();

        expect(result?.idDraw).toBeFalse();
        expect(result?.numberOfSteps).toBe(1);
    });

    it('should result be draw when betA = 101, betB = 101, and maxGameLength = 100', async () => {
        game = new CoinFlippingGame(new CoinFlippingGameInput(101, 101, 100));
        const result = await game.runExperiment();

        expect(result?.idDraw).toBeTrue();
        expect(result?.numberOfSteps).toBe(100);
        expect(result?.relativeDeviation).toBeLessThan(0.1);
    });

    

});