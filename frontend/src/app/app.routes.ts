import { Routes } from '@angular/router';
import { SearchResultsComponent } from './components/search-results/search-results';
import { RestaurantDetails } from './components/restaurant-details/restaurant-details';
import { AuthComponent } from './components/auth/auth';
import { AddRestaurantComponent } from './components/add-restaurant/add-restaurant';
import { HomeComponent } from './components/home/home';
import { AboutUsComponent } from './components/about-us/about-us';
import { MyAccountComponent } from './components/my-account/my-account';
import { AdminPanelComponent } from './components/admin-panel/admin-panel';
import { LeaderboardComponent } from './components/leaderboard/leaderboard';
import { VerifyCouponComponent } from './components/verify-coupon/verify-coupon';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'add', component: AddRestaurantComponent },
  { path: 'restaurant/:id', component: RestaurantDetails },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'my-account', component: MyAccountComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'verify-coupon', component: VerifyCouponComponent },
  { path: '**', redirectTo: 'home' }
];
