import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Your Node.js backend URL
  private baseUrl = '/api/restaurants';

  constructor(private http: HttpClient) { }

  // Get restaurants by city/name
  getRestaurants(city: string, name: string = ''): Observable<any> {
    return this.http.get(`${this.baseUrl}/search?city=${city}&name=${name}`);
  }

  getRestaurantById(id: string): Observable<any> {
    return this.http.get(`/api/restaurants/${id}`);
  }

  // Add a restaurant
  addRestaurant(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, data);
  }
  //send a review to the backend
  addReview(reviewData: any): Observable<any> {
    return this.http.post('/api/reviews/add', reviewData);
  }

  // 2. Get all reviews for a specific restaurant
  getReviewsByRestaurant(restaurantId: string): Observable<any> {
    return this.http.get(`/api/reviews/${restaurantId}`);
  }
}
