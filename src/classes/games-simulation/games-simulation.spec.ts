import { GamesSimulation, GameState, GlobalMap } from './games-simulation';

describe('GamesSimulation', () => {
  let simulation: GamesSimulation;

  beforeEach(() => {
    simulation = new GamesSimulation(3, 3, 1000, 10);
  });

  it('should run the simulation and update the global map', async () => {
    const onProgress = jasmine.createSpy('onProgress');
    const onComplete = jasmine.createSpy('onComplete');

    await simulation.startSimulation(onProgress, onComplete);

    expect(onProgress).toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should stop the simulation when stopSimulation is called', async () => {
    const onProgress = jasmine.createSpy('onProgress');
    const onComplete = jasmine.createSpy('onComplete');

    setTimeout(() => simulation.stopSimulation(), 0);
    await simulation.startSimulation(onProgress, onComplete);

    expect(onProgress.calls.count()).toBeLessThan(10);
    expect(onComplete).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should correctly update the global map', () => {
    const state: GameState = {
      numberOfSteps: 10,
      winA: true,
      winB: false,
      relativeDeviation: 0.1
    };

    simulation['updateGlobalMap'](state);

    const globalMap: GlobalMap = simulation['globalMap'];
    expect(globalMap[10]).toEqual({
      winsA: 1,
      winsB: 0,
      draws: 0,
      relativeDeviation: 0.1
    });
  });

  it('should correctly calculate relative deviation', () => {
    const state1: GameState = {
      numberOfSteps: 10,
      winA: true,
      winB: false,
      relativeDeviation: 0.1
    };
    const state2: GameState = {
      numberOfSteps: 10,
      winA: false,
      winB: true,
      relativeDeviation: 0.2
    };

    simulation['updateGlobalMap'](state1);
    simulation['updateGlobalMap'](state2);

    const globalMap: GlobalMap = simulation['globalMap'];
    expect(globalMap[10].relativeDeviation).toBeCloseTo(0.15, 2);
  });
});