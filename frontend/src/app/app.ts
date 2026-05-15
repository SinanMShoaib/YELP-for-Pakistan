import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('FitHae');
  currentTimePKT = signal('');
  isDarkMode = signal(false); // Default to Light Mode
  private timer: any;

  // Custom Cursor
  cursorX = 0;
  cursorY = 0;
  trails: { x: number, y: number }[] = [];

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
    
    // Check initial theme
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      this.isDarkMode.set(true);
      document.body.setAttribute('data-theme', 'dark');
    }

    // Mouse Tracking
    window.addEventListener('mousemove', (e) => {
      this.cursorX = e.clientX - 10;
      this.cursorY = e.clientY - 10;

      // Update trails
      this.trails.unshift({ x: this.cursorX + 5, y: this.cursorY + 5 });
      if (this.trails.length > 5) this.trails.pop();
    });
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  updateTime() {
    const options: Intl.DateTimeFormatOptions = { 
      timeZone: 'Asia/Karachi', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true
    };
    this.currentTimePKT.set(new Intl.DateTimeFormat('en-US', options).format(new Date()));
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  get isAdmin() {
    return this.authService.getUserRole?.() === 'admin';
  }
}
