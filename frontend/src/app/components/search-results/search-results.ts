import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css'
})
export class SearchResultsComponent implements OnInit {
  restaurants: any[] = [];

  // Renamed to match [(ngModel)]="searchCity" in the UI
  searchCity: string = '';
  searchName: string = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    // Initial search to populate the list on load
    this.search();
  }

  search() {
    // Removed the return check so it fetches all if inputs are empty
    this.api.getRestaurants(this.searchCity, this.searchName).subscribe({
      next: (data: any) => {
        this.restaurants = data;
      },
      error: (err) => console.error('Search failed:', err)
    });
  }
}
