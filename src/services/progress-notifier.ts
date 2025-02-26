import { Observable, Subject } from 'rxjs';
import { CoinFiippingGameSerieOutput } from '../classes/coin-flipping-game/coin-flipping-game-serie';

export class NotifierService {

  private static progressSubject = new Subject<number>();
  private static stateSubject = new Subject<CoinFiippingGameSerieOutput>();

  static getProgressObservable(): Observable<number> {
    return this.progressSubject.asObservable();
  }

  static notifyProgress(progressInPercent: number) {
    this.progressSubject.next(progressInPercent);
  }

  static getStateObservable(): Observable<CoinFiippingGameSerieOutput> {
    return this.stateSubject.asObservable();
  }

  static notifyState(state: CoinFiippingGameSerieOutput) {
    this.stateSubject.next(state);
  }
}