import { Component } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html', 
  styleUrls: ['./toolbar.component.scss'],
  standalone: true
})
export class ToolbarComponent {
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
  }
}