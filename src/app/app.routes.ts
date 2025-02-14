import { Routes } from '@angular/router';
import { SimpleCoinFlippingComponent } from '../components/simple-coin-flipping/simple-coin-flipping.component';
import { SettingsComponent } from '../components/settings/settings.component';

export const routes: Routes = [
    { path: 'simple-coin-flipping', component: SimpleCoinFlippingComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '', redirectTo: '/simple-coin-flipping', pathMatch: 'full' }
  ];
