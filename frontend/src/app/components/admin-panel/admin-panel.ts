import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanelComponent implements OnInit {
  pendingRestaurants: any[] = [];
  approvedRestaurants: any[] = [];
  message: string = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadPending();
    this.loadApproved();
  }

  loadPending() {
    this.api.getPendingRestaurants().subscribe({
      next: (data) => this.pendingRestaurants = data,
      error: (err) => this.message = "Failed to load pending restaurants."
    });
  }

  handleAction(id: string, action: 'approve' | 'reject') {
    this.api.verifyRestaurant(id, action).subscribe({
      next: (res) => {
        this.message = res.message;
        this.loadPending();
        this.loadApproved();
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => this.message = err.error?.message || "Action failed."
    });
  }

  loadApproved() {
    this.api.getRestaurants({}).subscribe({
      next: (data) => this.approvedRestaurants = data.filter((r: any) => r.status === 'Approved'),
      error: (err) => console.error("Failed to load approved restaurants")
    });
  }

  downloadQr(id: string, name: string) {
    this.api.getQrCode(id).subscribe({
      next: (blob: Blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `FitHae_Card_${name.replace(/\s+/g, '_')}.png`;
        link.click();
      },
      error: (err) => alert("Failed to download QR Card")
    });
  }
}
