import { Component } from '@angular/core';
import { NotifierService } from '../../../services/progress-notifier';  
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-progress',
    imports: [MatProgressBarModule],
    templateUrl: './progress.component.html',
    styleUrl: './progress.component.scss'
})
export class ProgressComponent {
  progressValue: number = 0;

  ngOnInit() {
    NotifierService.getProgressObservable().subscribe(numberInPercent => {
      this.progressValue = numberInPercent;
    });
  }
}
