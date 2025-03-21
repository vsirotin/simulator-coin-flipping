import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true
})
export class SettingsComponent {
  version = "1.0.3";
  buildDate = "2025.03.21 18:21.19"
}