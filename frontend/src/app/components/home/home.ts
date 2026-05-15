import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThreeBgComponent } from './three-bg.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ThreeBgComponent, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  weather: any = null;
  topRestaurants: any[] = [];
  weatherError: string = '';
  searchQuery: string = '';
  recentActivity: any[] = [];
  
  categories = [
    { name: 'Desi', icon: 'fa-solid fa-pepper-hot', color: '#ff4d4d' },
    { name: 'Fast Food', icon: 'fa-solid fa-burger', color: '#ffcc00' },
    { name: 'Cafe', icon: 'fa-solid fa-coffee', color: '#996633' },
    { name: 'Chinese', icon: 'fa-solid fa-bowl-rice', color: '#cc0000' },
    { name: 'Bakery', icon: 'fa-solid fa-bread-slice', color: '#ff9933' },
    { name: 'Steaks', icon: 'fa-solid fa-drumstick-bite', color: '#663300' }
  ];

  constructor(private http: HttpClient, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchWeather();
    this.loadTopPicks();
    this.loadRecentActivity();
  }

  fetchWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
          
          this.http.get(url).subscribe({
            next: (data: any) => {
              this.weather = data.current_weather;
            },
            error: (err) => this.weatherError = "Could not fetch weather data."
          });
        },
        (error) => {
          this.weatherError = "Location access denied. Weather unavailable.";
        }
      );
    } else {
      this.weatherError = "Geolocation is not supported by this browser.";
    }
  }

  loadTopPicks() {
    this.api.getRestaurants('', '').subscribe({
      next: (data) => {
        this.topRestaurants = data
          .sort((a: any, b: any) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 4);
      },
      error: (err) => console.error("Failed to load top picks", err)
    });
  }

  loadRecentActivity() {
    this.http.get('/api/reviews/recent/all').subscribe({
      next: (data: any) => {
        this.recentActivity = data.map((rev: any) => ({
          user: rev.userName,
          restaurant: rev.restaurant?.name || 'Unknown',
          rating: rev.rating,
          comment: rev.comment
        }));
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { name: this.searchQuery } });
    }
  }

  searchCategory(cat: string) {
    this.router.navigate(['/search'], { queryParams: { category: cat } });
  }
}
