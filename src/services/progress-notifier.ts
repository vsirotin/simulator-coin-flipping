import { Subject } from 'rxjs';

export class NotifierService {
  private static progressSubject = new Subject<number>();

  static getProgressObservable() {
    return this.progressSubject.asObservable();
  }

  static notifyProgress(progressInPercent: number) {
    this.progressSubject.next(progressInPercent);
  }
}