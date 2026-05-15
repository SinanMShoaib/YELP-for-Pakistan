import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-restaurant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-restaurant.html',
  styleUrls: ['./add-restaurant.css']
})
export class AddRestaurantComponent {
  googleMapsLink: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  showManual: boolean = false;
  
  manualData = {
    name: '',
    location: '',
    city: '',
    imageUrl: '',
    description: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onAdd(isManual: boolean = false) {
    this.isLoading = true;
    this.errorMessage = '';

    const payload = isManual ? { manualData: this.manualData } : { googleMapsLink: this.googleMapsLink };

    this.http.post('/api/restaurants/add', payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const restaurantId = res.restaurant?._id || res._id;
        if (restaurantId) {
          this.router.navigate(['/restaurant', restaurantId], {
            queryParams: { newlyAdded: 'true' }
          });
        } else {
          this.router.navigate(['/search']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error adding restaurant. Please check the link.';
      }
    });
  }
}
