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

  // Get restaurants with optional filters
  getRestaurants(filters: any = {}): Observable<any> {
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.name) params.set('name', filters.name);
    if (filters.category) params.set('category', filters.category);
    if (filters.price) params.set('price', filters.price);
    if (filters.amenity) params.set('amenity', filters.amenity);
    
    return this.http.get(`${this.baseUrl}/search?${params.toString()}`);
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

  // Admin Routes
  getPendingRestaurants(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/pending`);
  }

  verifyRestaurant(id: string, action: 'approve' | 'reject'): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/verify`, { action });
  }

  getUserSubmissions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/submissions`);
  }

  getQrCode(id: string): Observable<Blob> {
    return this.http.get(`/api/restaurants/${id}/qr`, { responseType: 'blob' });
  }
}
