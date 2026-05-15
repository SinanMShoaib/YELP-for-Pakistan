import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-coupon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5 page-container d-flex align-items-center justify-content-center" style="min-height: 80vh;">
      <div class="glass-panel p-5 text-center" style="max-width: 500px; width: 100%;">
        <h2 class="fw-bold text-white mb-4"><i class="fa-solid fa-ticket text-danger me-2"></i>Verify Coupon</h2>
        <p class="text-secondary mb-4">Enter the Unique Coupon ID to check its validity and status.</p>

        <div class="mb-4">
          <input type="text" class="form-control form-control-lg text-center fw-bold" 
                 placeholder="e.g. FITHAE-A1B2C3" 
                 [(ngModel)]="couponId" 
                 (keyup.enter)="verify()">
        </div>

        <button class="btn btn-primary-custom btn-lg w-100 fw-bold" 
                (click)="verify()" 
                [disabled]="isLoading || !couponId">
          {{ isLoading ? 'Verifying...' : 'VERIFY NOW' }}
        </button>

        <div *ngIf="result" class="mt-4 animate-fade-in">
          <div class="alert" [ngClass]="result.valid ? 'alert-success' : 'alert-danger'">
            <h4 class="fw-bold mb-1">{{ result.valid ? 'Valid Coupon!' : 'Invalid Coupon' }}</h4>
            <p class="mb-0">{{ result.message }}</p>
          </div>
          
          <div *ngIf="result.coupon" class="text-start mt-3 p-3 rounded bg-dark border border-secondary">
            <p class="mb-1 small text-secondary">Redeemed By:</p>
            <p class="fw-bold text-white">{{ result.coupon.userId?.name }} (@{{ result.coupon.userId?.username }})</p>
            <p class="mb-1 small text-secondary">Value:</p>
            <p class="fw-bold text-danger">{{ result.coupon.discountValue }}</p>
            <p class="mb-1 small text-secondary">Expires:</p>
            <p class="text-white">{{ result.coupon.expiryDate | date:'mediumDate' }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VerifyCouponComponent {
  couponId: string = '';
  isLoading: boolean = false;
  result: any = null;

  constructor(private http: HttpClient) {}

  verify() {
    if (!this.couponId) return;
    this.isLoading = true;
    this.result = null;

    this.http.get<any>(`/api/coupons/verify/${this.couponId}`).subscribe({
      next: (res) => {
        this.result = { ...res, valid: true };
        this.isLoading = false;
      },
      error: (err) => {
        this.result = { valid: false, message: err.error?.message || "Verification failed." };
        this.isLoading = false;
      }
    });
  }
}
