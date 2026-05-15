import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css'
})
export class MyAccountComponent implements OnInit {
  user: any = { name: '', username: '', email: '', bio: '', role: '', fitHaeTokens: 0 };
  submissions: any[] = [];
  message: string = '';
  isError: boolean = false;
  redeemedCoupon: any = null;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadSubmissions();
  }

  loadUserData() {
    this.authService.getMe().subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error("Failed to fetch user data")
    });
  }

  loadSubmissions() {
    this.api.getUserSubmissions().subscribe({
      next: (data) => this.submissions = data,
      error: (err) => console.error("Failed to fetch submissions")
    });
  }

  updateProfile() {
    this.authService.updateProfile({
      name: this.user.name,
      username: this.user.username,
      bio: this.user.bio
    }).subscribe({
      next: (res) => {
        this.message = "Profile updated successfully!";
        this.isError = false;
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.message = err.error.message || "Failed to update profile";
        this.isError = true;
      }
    });
  }

  updatePassword(newPass: string) {
    if (!newPass || newPass.length < 8) {
      this.message = "Password must be at least 8 characters.";
      this.isError = true;
      return;
    }
    // We reuse the updateProfile endpoint or a dedicated one if available
    this.http.put('/api/auth/profile', { password: newPass }).subscribe({
      next: () => {
        this.message = "Password updated successfully!";
        this.isError = false;
      },
      error: (err) => {
        this.message = "Failed to update password.";
        this.isError = true;
      }
    });
  }

  redeemTokens() {
    if (this.user.fitHaeTokens < 1) {
      alert("You need at least 1 FitHae Token to redeem a coupon!");
      return;
    }

    this.http.post<any>('/api/coupons/redeem', {}).subscribe({
      next: (res) => {
        this.redeemedCoupon = res.coupon;
        this.user.fitHaeTokens = res.remainingTokens;
        alert("Coupon Redeemed! You can now download your Privilege Pass.");
      },
      error: (err) => alert(err.error?.message || "Redemption failed")
    });
  }

  downloadCoupon(couponId: string) {
    this.http.get(`/api/coupons/download/${couponId}`, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `FitHae_Coupon_${couponId}.png`;
        link.click();
      },
      error: (err) => alert("Failed to download coupon card.")
    });
  }
}
