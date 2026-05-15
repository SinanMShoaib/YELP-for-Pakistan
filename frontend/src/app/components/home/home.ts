import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api';
import { RouterLink } from '@angular/router';
import { ThreeBgComponent } from './three-bg.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ThreeBgComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  weather: any = null;
  topRestaurants: any[] = [];
  weatherError: string = '';

  constructor(private http: HttpClient, private api: ApiService) {}

  ngOnInit() {
    this.fetchWeather();
    this.loadTopPicks();
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
    // We fetch all verified restaurants and take the top 3 by rating
    this.api.getRestaurants('', '').subscribe({
      next: (data) => {
        this.topRestaurants = data
          .sort((a: any, b: any) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 3);
      },
      error: (err) => console.error("Failed to load top picks", err)
    });
  }
}
