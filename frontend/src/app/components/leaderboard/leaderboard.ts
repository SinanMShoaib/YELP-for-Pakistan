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
        <div class="badge rounded-pill bg-danger bg-opacity-10 text-danger px-3 py-2 mb-3 fw-bold animate-fade-in">Hall of Fame</div>
        <h1 class="display-3 fw-bold" style="color: var(--text-color);">🏆 Foodie <span class="text-danger">Leaderboard</span></h1>
        <p class="lead" style="color: var(--text-muted);">Top contributors fueling Pakistan's culinary discovery.</p>
      </div>

      <div class="row justify-content-center">
        <div class="col-md-9">
          <div class="glass-panel p-0 overflow-hidden shadow-lg border-0 animate-fade-in">
            <div class="table-responsive">
              <table class="table mb-0">
                <thead>
                  <tr style="background: rgba(220, 38, 38, 0.05);">
                    <th class="ps-4 py-4 border-0" style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Rank</th>
                    <th class="py-4 border-0" style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Foodie Profile</th>
                    <th class="py-4 border-0 text-center" style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">FitHae Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of leaderboard; let i = index" class="align-middle hover-lift-subtle">
                    <td class="ps-4 py-4">
                      <div class="rank-badge" [ngClass]="{'gold': i === 0, 'silver': i === 1, 'bronze': i === 2, 'regular': i > 2}">
                        {{ i + 1 }}
                      </div>
                    </td>
                    <td class="py-4">
                      <div class="d-flex align-items-center">
                        <div class="avatar-container me-3">
                          <img [src]="user.profileImage || 'assets/default-avatar.png'" class="rounded-circle shadow-sm">
                          <div class="status-indicator" *ngIf="i < 3"></div>
                        </div>
                        <div>
                          <span class="fw-bold d-block" style="color: var(--text-color);">{{ user.username || user.name }}</span>
                          <span class="x-small" style="color: var(--text-muted); font-size: 0.75rem;">Master Contributor</span>
                        </div>
                      </div>
                    </td>
                    <td class="text-center py-4">
                      <span class="token-count fw-bold text-danger fs-5">
                        {{ user.fitHaeTokens }} <i class="fa-solid fa-coins ms-1 text-warning"></i>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div *ngIf="leaderboard.length === 0" class="text-center py-5">
              <div class="spinner-border text-danger" role="status"></div>
              <p class="mt-3" style="color: var(--text-muted);">Summoning the champions...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-container { position: relative; width: 45px; height: 45px; }
    .avatar-container img { width: 100%; height: 100%; object-fit: cover; border: 2px solid var(--glass-border); }
    .status-indicator { position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; background: #22c55e; border: 2px solid var(--bg-card); border-radius: 50%; }
    
    .rank-badge {
      width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;
      border-radius: 10px; font-weight: 800; font-size: 0.9rem;
    }
    .gold { background: linear-gradient(135deg, #fbbf24, #d97706); color: white; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3); }
    .silver { background: linear-gradient(135deg, #94a3b8, #475569); color: white; box-shadow: 0 4px 12px rgba(71, 85, 105, 0.3); }
    .bronze { background: linear-gradient(135deg, #a85507, #78350f); color: white; box-shadow: 0 4px 12px rgba(120, 53, 15, 0.3); }
    .regular { background: var(--input-bg); color: var(--text-muted); border: 1px solid var(--glass-border); }
    
    .hover-lift-subtle { transition: all 0.2s ease; }
    .hover-lift-subtle:hover { background: rgba(220, 38, 38, 0.02); }
    .token-count { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; background: rgba(220, 38, 38, 0.05); }
    
    table td { border-bottom: 1px solid var(--glass-border) !important; }
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
