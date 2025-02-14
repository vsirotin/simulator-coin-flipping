import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { SimpleCoinFlippingComponent } from '../components/simple-coin-flipping/simple-coin-flipping.component';
import { SettingsComponent } from '../components/settings/settings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToolbarComponent,
    SidebarComponent,
    SimpleCoinFlippingComponent,
    SettingsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'simulator-coin-flipping';
}
