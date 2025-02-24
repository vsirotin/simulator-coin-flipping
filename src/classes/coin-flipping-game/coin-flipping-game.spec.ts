import { CoinFlippingGame, CoinFlippingGameInput, CoinFiippingGameOutput } from './coin-flipping-game';

describe('CoinFlippingGame', () => {


    it('should create an instance of CoinFlippingGame', () => {
        const game = new CoinFlippingGame(new CoinFlippingGameInput(5, 5, 4));
        expect(game).toBeTruthy();
    });

    it('should result be draw when betA = 5, betB = 5, and maxGameLength = 4', async () => {
        const game = new CoinFlippingGame(new CoinFlippingGameInput(5, 5, 4));
        const result = await game.runExperiment();

        expect(result?.isDraw).toBeTrue();
    });

    it('should result be NOT draw when betA = 1, betB = 1, and maxGameLength = 1', async () => {
        const game = new CoinFlippingGame(new CoinFlippingGameInput(1, 1, 1));
        const result = await game.runExperiment();

        expect(result?.isDraw).toBeFalse();
        expect(result?.numberOfSteps).toBe(1);
    });

    it('should result be draw when betA = 101, betB = 101, and maxGameLength = 100', async () => {
        const game = new CoinFlippingGame(new CoinFlippingGameInput(101, 101, 100));
        const result = await game.runExperiment();

        expect(result?.isDraw).toBeTrue();
        expect(result?.numberOfSteps).toBe(100);
        const flippingA = result?.countFlippingA ?? 0;
        const relativeDevitation = Math.abs(flippingA - 50)/100; 
        expect(relativeDevitation).toBeLessThan(0.15);
    });

    describe(' by prepared random generator', () => {

        it('when by each step wins A should result be Winner A when betA = 10, betB = 10, and maxGameLength = 11', async () => {
            const game = new CoinFlippingGame(new CoinFlippingGameInput(10, 10, 11));
            game.experimentStep.generatorUniformDistribution = {
                generate: () => true
            };

            const result = await game.runExperiment();
    
            expect(result?.isWinnerA).toBeTrue();
            expect(result?.isDraw).toBeFalse();
            expect(result?.numberOfSteps).toBe(10);
            expect(result?.countFlippingA).toBe(10);
        });

        it('when by each step wins B should result be Winner B when betA = 10, betB = 10, and maxGameLength = 11', async () => {
            const game = new CoinFlippingGame(new CoinFlippingGameInput(10, 10, 11));
            game.experimentStep.generatorUniformDistribution = {
                generate: () => false
            };

            const result = await game.runExperiment();
    
            expect(result?.isWinnerA).toBeFalse();
            expect(result?.isDraw).toBeFalse();
            expect(result?.numberOfSteps).toBe(10);
            expect(result?.countFlippingA).toBe(0);
        });

        it('when by each step wins another should result be draw when betA = 2, betB = 2, and maxGameLength = 100', async () => {
            const game = new CoinFlippingGame(new CoinFlippingGameInput(2, 2, 100));
            let flip = false;

            function generateFlip(): boolean {
                flip = !flip;
                return flip;
            }
            game.experimentStep.generatorUniformDistribution = {
                generate: generateFlip
            };

            const result = await game.runExperiment();
    
            expect(result?.isWinnerA).toBeFalse();
            expect(result?.isDraw).toBeTrue();
            expect(result?.numberOfSteps).toBe(100);
            expect(result?.countFlippingA).toBe(50);
        });
    });

    

});