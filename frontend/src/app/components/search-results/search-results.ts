import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css'
})
export class SearchResultsComponent implements OnInit {
  restaurants: any[] = [];
  isLoading: boolean = false;

  filters = {
    city: '',
    name: '',
    category: ''
  };

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Listen for query parameter changes
    this.route.queryParams.subscribe(params => {
      this.filters.name = params['name'] || '';
      this.filters.city = params['city'] || '';
      this.filters.category = params['category'] || '';
      this.search();
    });
  }

  search() {
    this.isLoading = true;
    this.api.getRestaurants(this.filters).subscribe({
      next: (data: any) => {
        this.restaurants = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.isLoading = false;
      }
    });
  }
}
