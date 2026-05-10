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

  constructor(private http: HttpClient, private router: Router) {}

  onAdd() {
    this.isLoading = true;

    // We only send the link now. The backend handles the rest!
    this.http.post('http://localhost:3000/api/restaurants/add', {
      googleMapsLink: this.googleMapsLink
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        alert('Restaurant added successfully!');
        this.router.navigate(['/search']); // Take them to see the new addition
      },
      error: (err) => {
        this.isLoading = false;
        alert(err.error.message || 'Error adding restaurant');
      }
    });
  }
}
