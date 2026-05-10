import { Routes } from '@angular/router'; // Only one import from router
import { SearchResultsComponent } from './components/search-results/search-results';
import { RestaurantDetails } from './components/restaurant-details/restaurant-details';
import { AuthComponent } from './components/auth/auth';

// Check if your file is named add-restaurant.ts or add-restaurant.component.ts
import { AddRestaurantComponent } from './components/add-restaurant/add-restaurant';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' }, // Redirect Home to Auth
  { path: 'auth', component: AuthComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'add', component: AddRestaurantComponent },
  { path: 'restaurant/:id', component: RestaurantDetails },
  { path: '**', redirectTo: 'auth' }
];
