import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        ToolbarComponent,
        SidebarComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'simulator-coin-flipping';
}
