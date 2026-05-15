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
      <div class="glass-panel p-5 text-center animate-fade-in" style="max-width: 500px; width: 100%;">
        <h2 class="fw-bold mb-4" style="color: var(--text-color);"><i class="fa-solid fa-ticket text-danger me-2"></i>Verify Coupon</h2>
        <p style="color: var(--text-muted);" class="mb-4">Enter the Unique Coupon ID to check its validity and status.</p>

        <div class="mb-4">
          <input type="text" class="form-control form-control-lg text-center fw-bold" 
                 placeholder="e.g. FITHAE-A1B2C3" 
                 [(ngModel)]="couponId" 
                 (keyup.enter)="verify()"
                 style="letter-spacing: 2px; text-transform: uppercase;">
        </div>

        <button class="btn btn-primary-custom btn-lg w-100 fw-bold" 
                (click)="verify()" 
                [disabled]="isLoading || !couponId">
          {{ isLoading ? 'VERIFYING SECURITY KEY...' : 'VALIDATE COUPON' }}
        </button>

        <div *ngIf="result" class="mt-4 animate-fade-in">
          <div class="alert glass-panel border-0 shadow-sm" [ngClass]="result.valid ? 'text-success' : 'text-danger'">
            <h4 class="fw-bold mb-1"><i class="fa-solid me-2" [ngClass]="result.valid ? 'fa-circle-check' : 'fa-circle-xmark'"></i>{{ result.valid ? 'Active Coupon!' : 'Invalid Request' }}</h4>
            <p class="mb-0 small">{{ result.message }}</p>
          </div>
          
          <div *ngIf="result.coupon" class="text-start mt-3 p-4 glass-panel border-0 shadow-sm">
            <div class="mb-3">
              <label class="x-small text-uppercase fw-bold opacity-50" style="color: var(--text-color); font-size: 0.7rem;">Redeemed By</label>
              <p class="fw-bold m-0" style="color: var(--text-color);">{{ result.coupon.userId?.name }} <span class="fw-normal opacity-75">(@{{ result.coupon.userId?.username }})</span></p>
            </div>
            <div class="row">
              <div class="col-6">
                <label class="x-small text-uppercase fw-bold opacity-50" style="color: var(--text-color); font-size: 0.7rem;">Discount</label>
                <p class="fw-bold m-0 text-danger fs-4">15% OFF</p>
              </div>
              <div class="col-6">
                <label class="x-small text-uppercase fw-bold opacity-50" style="color: var(--text-color); font-size: 0.7rem;">Expires</label>
                <p class="m-0" style="color: var(--text-color);">{{ result.coupon.expiryDate | date:'mediumDate' }}</p>
              </div>
            </div>
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
