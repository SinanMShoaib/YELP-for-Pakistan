import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5 page-container">
      <div class="text-center mb-5">
        <h1 class="display-3 fw-bold text-white">🏆 Foodie <span class="text-danger">Leaderboard</span></h1>
        <p class="lead text-secondary">Top contributors fueling Pakistan's culinary discovery.</p>
      </div>

      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="glass-panel p-0 overflow-hidden">
            <table class="table table-dark table-hover mb-0">
              <thead>
                <tr class="bg-dark text-uppercase small fw-bold text-secondary">
                  <th class="ps-4 py-3">Rank</th>
                  <th class="py-3">Foodie</th>
                  <th class="py-3 text-center">FitHae Tokens</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of leaderboard; let i = index" class="align-middle">
                  <td class="ps-4">
                    <span class="badge" [ngClass]="{'bg-warning text-dark': i === 0, 'bg-secondary': i === 1, 'bg-bronze': i === 2, 'bg-dark': i > 2}">
                      #{{ i + 1 }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <img [src]="user.profileImage || 'assets/default-avatar.png'" class="rounded-circle me-3" style="width: 40px; height: 40px; object-fit: cover;">
                      <span class="fw-bold">{{ user.username || 'Anonymous' }}</span>
                    </div>
                  </td>
                  <td class="text-center fw-bold text-danger">
                    {{ user.fitHaeTokens }} <i class="fa-solid fa-coins ms-1"></i>
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="leaderboard.length === 0" class="text-center py-5">
              <div class="spinner-border text-danger" role="status"></div>
              <p class="text-muted mt-3">Loading champions...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-bronze { background-color: #cd7f32; color: white; }
    table { background: transparent !important; }
    th { border-bottom: 2px solid var(--glass-border) !important; }
    td { border-bottom: 1px solid var(--glass-border) !important; color: white; }
    tr:last-child td { border-bottom: none; }
  `]
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('/api/restaurants/leaderboard').subscribe({
      next: (data) => this.leaderboard = data,
      error: (err) => console.error("Leaderboard error", err)
    });
  }
}
