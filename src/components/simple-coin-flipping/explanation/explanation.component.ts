import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NotifierService } from '../../../services/progress-notifier';

@Component({
  selector: 'app-explanation',
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.scss'],
  imports: [MatExpansionModule],
  standalone: true
})
export class ExplanationComponent {
  isExpanded: boolean = true;

  ngOnInit() {
      NotifierService.getStateObservable().subscribe(state => {
        if(this.isExpanded) {
          this.isExpanded = false;
        }
      });
  }
}