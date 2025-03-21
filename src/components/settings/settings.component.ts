import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true
})
export class SettingsComponent {
  version = "1.0.2";
  buildDate = "2025.03.21 09:20.09"
}