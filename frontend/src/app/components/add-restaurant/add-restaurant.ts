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
  errorMessage: string = ''; // Added to handle the styled alert in HTML

  constructor(private http: HttpClient, private router: Router) {}

  onAdd() {
    this.isLoading = true;
    this.errorMessage = ''; // Clear any previous error messages

    this.http.post('/api/restaurants/add', {
      googleMapsLink: this.googleMapsLink
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('Backend response:', res);

        const restaurantId = res.restaurant?._id || res._id;

        // Instead of search, go to the specific restaurant details page
        // We pass 'newlyAdded: true' as a query parameter to show the success banner
        if (restaurantId) {
          this.router.navigate(['/restaurant', restaurantId], {
            queryParams: { newlyAdded: 'true' }
          });
        } else {
          console.warn('No restaurant ID returned from backend, navigating to search as fallback.');
          this.router.navigate(['/search']);
        }
      },
      error: (err) => {
        this.isLoading = false; // Button becomes clickable again

        // Capture the error message from the backend (e.g., "City not supported")
        this.errorMessage = err.error?.message || 'Error adding restaurant. Please check the link.';

        // No more alert() - the HTML *ngIf="errorMessage" will handle this now
      }
    });
  }
}
