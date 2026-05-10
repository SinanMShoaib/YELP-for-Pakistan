import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth'; // 1. Import AuthService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurant-details.html',
  styleUrl: './restaurant-details.css'
})
export class RestaurantDetails implements OnInit {
  restaurant: any;
  reviews: any[] = [];

  // 2. Flatten these to match the [(ngModel)] names in the UI
  newRating: number = 5;
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public authService: AuthService, // 3. Inject it as public
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getRestaurantById(id).subscribe({
        next: (data: any) => {
          this.restaurant = data;
          this.loadReviews(id);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Could not load restaurant', err)
      });
    }
  }

  loadReviews(restaurantId: string) {
    this.api.getReviewsByRestaurant(restaurantId).subscribe({
      next: (data: any) => {
        this.reviews = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Could not load reviews', err)
    });
  }

  submitReview() {
    // 4. Update validation to match the new flattened variables
    if (!this.newComment || !this.newRating) {
      alert('Please fill in all fields!');
      return;
    }

    const reviewData = {
      restaurantId: this.restaurant._id,
      rating: this.newRating,
      comment: this.newComment
      // No userName here! Backend handles it.
    };

    this.api.addReview(reviewData).subscribe({
      next: (res: any) => {
        this.reviews.unshift(res);
        this.newComment = ''; // Reset form
        this.newRating = 5;

        // Refresh restaurant data to update the average rating on screen
        const id = this.restaurant._id;
        this.api.getRestaurantById(id).subscribe(data => this.restaurant = data);

        alert('Review posted!');
      },
      error: (err) => alert(err.error.message || 'Failed to post review.')
    });
  }
}
